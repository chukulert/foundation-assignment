const db = require("../config/database");
const { checkGroupId, createDateTime } = require("../utils/helpers");
const { findApplication } = require("./applicationController");

const getTask = async (taskId) => {
  const query = `SELECT * FROM assignment.tasks WHERE task_id = ?`;
  const queryPlans = await db.promise().query(query, [taskId]);
  const results = queryPlans[0][0];
  return results;
};

exports.getAllTasks = async (req, res) => {
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
  const { task_name, task_description, task_plan, task_state } = req.body;

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

    const taskNote = JSON.stringify([
      {
        userId: req.user.id,
        task_state,
        Timestamp: date,
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
        task_state,
        req.user.id,
        req.user.id,
        date,
        taskNote,
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

const addTaskNotes = (userId, task, state) => {
  const taskNotes = JSON.parse(task.task_notes);

  const newTaskNote = {
    userId,
    state,
    Timestamp: createDateTime(),
  };

  return JSON.stringify([...taskNotes, newTaskNote]);
};

exports.updateTaskState = async (req, res) => {
  const { appId, taskId } = req.params;

  const state = req.body.state;

  const application = await findApplication(appId);

  try {
    const task = await getTask(taskId);
    const currentState = task.task_state;
    if (!task || !task.task_plan_acronym === appId) {
      return res
        .status(401)
        .json({ message: "There is no task available in this application." });
    }

    const permitted = await permittedUser(
      state,
      currentState,
      application,
      req.user.id
    );

    if (permitted) {
      const taskNotes = addTaskNotes(req.user.id, task, state);

      const query =
        "UPDATE assignment.tasks SET task_state = ?, task_owner = ?, task_notes = ? WHERE task_id = ?";
      await db.promise().query(query, [state, req.user.id, taskNotes, taskId]);

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
