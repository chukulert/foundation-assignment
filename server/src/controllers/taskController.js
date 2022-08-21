const db = require("../config/database");
const {
  checkGroupId,
  createDateTime,
  checkGroupName,
} = require("../utils/helpers");
const { findApplication } = require("./applicationController");
const sendEmail = require("../utils/email");
const userController = require("./userController");

const getTask = async (taskId) => {
  const query = `SELECT * FROM assignment.tasks WHERE task_id = ?`;
  const queryTasks = await db.promise().query(query, [taskId]);
  const results = queryTasks[0][0];
  return results;
};

exports.findTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const query = `SELECT * FROM assignment.tasks WHERE task_id = ?`;
    const queryTask = await db.promise().query(query, [taskId]);
    const results = queryTask[0][0];
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const query = `SELECT * FROM assignment.tasks`;
    const queryTasks = await db.promise().query(query);
    const results = queryTasks[0];
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllApplicationTasks = async (req, res) => {
  const app_acronym = req.params.appId;
  try {
    const query = `SELECT * FROM assignment.tasks WHERE task_app_acronym = ?`;
    const queryPlans = await db.promise().query(query, [app_acronym]);
    const results = queryPlans[0];
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.createTask = async (req, res, next) => {
  const appAcronym = req.params.appId;
  const { task_name, task_description, task_plan } = req.body;

  try {
    /** check for existing application */
    const application = await findApplication(appAcronym);

    const permittedUser = await checkGroupId(
      req.user.id,
      application.app_permit_create
    );


    if (!permittedUser) {
      return res.status(401).json({
        message: "You are not permitted to create a task.",
      });
    }
    /** If permitted */
    const taskId = `${application.app_acronym}_${+application.app_Rnumber + 1}`;

    const date = createDateTime();

    const newTaskNote = JSON.stringify([
      {
        userId: req.user.id,
        state: "open",
        Timestamp: createDateTime(),
        notes: "Task created <system generated>",
      },
    ]);

    const query =
      "INSERT INTO assignment.tasks (task_id, task_name, task_description, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createDate, task_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
    const newTask = db
      .promise()
      .query(query, [
        taskId,
        task_name,
        task_description,
        task_plan,
        appAcronym,
        "open",
        req.user.id,
        req.user.id,
        date,
        newTaskNote,
      ]);

    const query2 =
      "UPDATE assignment.applications SET app_Rnumber = ? WHERE app_acronym = ?";
    const updateApp = db
      .promise()
      .query(query2, [+application.app_Rnumber + 1, appAcronym]);

    await Promise.all([newTask, updateApp]);
    return res.status(200).json({ message: "Task successfully created" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const addTaskNotes = (userId, task, state, notes) => {
  const taskNotes = JSON.parse(task.task_notes);

  const newTaskNote = {
    userId,
    state,
    Timestamp: createDateTime(),
    notes,
  };

  return JSON.stringify([...taskNotes, newTaskNote]);
};

exports.editTask = async (req, res) => {
  const { taskId } = req.params;
  const { notes, task_plan } = req.body;


  if (!notes && task_plan === undefined)
    return res.status(500).json({ message: "There is no data sent." });

  try {
    const task = await getTask(taskId);
    if (!task) {
      return res
        .status(401)
        .json({ message: "There is no task available in this application." });
    }

    const state = task.task_state;

    if (task_plan || task_plan === "") {
      const permittedUser = await checkGroupName(req.user.id, "manager");

      if (!permittedUser) {
        return res.status(401).json({
          message: "You do not have permission to perform this action.",
        });
      }
      const taskNotes = addTaskNotes(
        req.user.id,
        task,
        state,
        task_plan === ""
          ? "Removed task plan"
          : `Task plan updated to ${task_plan}`
      );
      const query =
        "UPDATE assignment.tasks SET task_notes = ?, task_plan = ? WHERE task_id = ?";
      await db.promise().query(query, [taskNotes, task_plan, taskId]);
      res.status(200).json({ message: "Task plan successfully updated." });
    } else {
      const taskNotes = addTaskNotes(req.user.id, task, state, notes);
      const query =
        "UPDATE assignment.tasks SET task_notes = ? WHERE task_id = ?";
      await db.promise().query(query, [taskNotes, taskId]);
      res.status(200).json({ message: "Task note successfully added." });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const permittedUser = async (state, currentState, application, userId) => {
  if (state === "toDoList" && currentState === "open") {
    return await checkGroupId(userId, application.app_permit_toDoList);
  } else if (state === "doing" && currentState === "toDoList") {
    return await checkGroupId(userId, application.app_permit_doing);
  } else if (state === "toDoList" && currentState === "doing") {
    return await checkGroupId(userId, application.app_permit_doing);
  } else if (state === "done" && currentState === "doing") {
    return await checkGroupId(userId, application.app_permit_done);
  } else if (state === "close" && currentState === "done") {
    return await checkGroupId(userId, application.app_permit_close);
  } else if (state === "doing" && currentState === "done") {
    return await checkGroupId(userId, application.app_permit_close);
  }
  return false;
};

exports.sendEmailNotification = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await getTask(taskId);
    if (!task || task.task_state !== "done")
      return res
        .status(500)
        .json({ message: "Task does not exist / is not completed" });

    const leadUsers = await userController.getLeadUsers();

    Promise.all(
      leadUsers.map(async (user) => {
        await sendEmail({
          email: user.email,
          subject: `Task (ID:${task.task_id})'s completion is pending your approval`,
          message: `Task (ID:${
            task.task_id
          })'s completion is pending your approval\nApplication: ${
            task.task_app_acronym
          }\nPlan: ${task.task_plan}\nSent on ${createDateTime()}`,
        });
      })
    );
    res.status(200).json({ messsage: "Emails successfully sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskState = async (req, res) => {
  const { appId, taskId } = req.params;

  const state = req.body.state;

  const application = await findApplication(appId);

  try {
    const task = await getTask(taskId);

    if (!task || !task.task_plan_acronym === application.app_acronym) {
      return res
        .status(401)
        .json({ message: "There is no task available in this application." });
    }
    const currentState = task.task_state;
    const permitted = await permittedUser(
      state,
      currentState,
      application,
      req.user.id
    );

    const newTaskNote = addTaskNotes(
      req.user.id,
      task,
      state,
      `Task status changed to ${state}. <system generated>`
    );

    if (permitted) {
      const query =
        "UPDATE assignment.tasks SET task_state = ?, task_owner = ?, task_notes = ? WHERE task_id = ?";
      await db
        .promise()
        .query(query, [state, req.user.id, newTaskNote, taskId]);

      return res
        .status(200)
        .json({ message: "Task state successfully updated" });
    } else {
      return res.status(401).json({
        message: "You are not permitted to perform this action.",
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
