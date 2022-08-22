const db = require("../config/database");
const { checkGroupName } = require("../utils/helpers");

const findApplication = async (appId) => {
  const query = `SELECT * FROM assignment.applications WHERE app_acronym = ?`;
  const results = await db.promise().query(query, [appId]);
  return results[0][0];
};

exports.findApplication = findApplication;

exports.getAllApplications = async (req, res, next) => {
  try {
    const query = `SELECT * FROM assignment.applications`;
    const queryApplications = await db.promise().query(query);
    const results = queryApplications[0];
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.createApplication = async (req, res, next) => {
  const {
    app_acronym,
    app_description,
    app_Rnumber,
    app_startDate,
    app_endDate,
    app_permit_create,
    app_permit_toDoList,
    app_permit_doing,
    app_permit_done,
    app_permit_close,
  } = req.body;

  if (app_startDate > app_endDate) {
    return res
      .status(400)
      .json({ message: "Starting Date cannot be later than End Date" });
  }

  try {
    /** check for existing application */
    const existingApplication = await findApplication(app_acronym);
    const leadUser = await checkGroupName(req.user.id, "lead");
    if (!leadUser) {
      return res.status(401).json({
        message: "You do not have access rights to create an application",
      });
    } else if (existingApplication) {
      return res.status(401).json({ message: "App acronym already exists." });
    } else {
      /** If application acronym is acceptable */
      const query =
        "INSERT INTO assignment.applications (app_acronym, app_description, app_Rnumber, app_startDate, app_endDate, app_permit_create, app_permit_toDoList, app_permit_doing, app_permit_done, app_permit_close) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
      await db
        .promise()
        .query(query, [
          app_acronym,
          app_description,
          app_Rnumber,
          app_startDate,
          app_endDate,
          JSON.stringify(app_permit_create),
          JSON.stringify(app_permit_toDoList),
          JSON.stringify(app_permit_doing),
          JSON.stringify(app_permit_done),
          JSON.stringify(app_permit_close),
        ]);

      return res
        .status(200)
        .json({ message: "Application successfully created" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.editApplication = async (req, res, next) => {
  const { appId } = req.params;

  const {
    app_permit_create,
    app_permit_toDoList,
    app_permit_doing,
    app_permit_done,
    app_permit_close,
  } = req.body;

  try {
  
    const leadUser = await checkGroupName(req.user.id, "lead");
    if (!leadUser) {
      return res.status(401).json({
        message: "You do not have access rights to create an application",
      });
    } else {
      const query =
        "UPDATE assignment.applications SET app_permit_create = ?, app_permit_toDoList = ?, app_permit_doing = ?, app_permit_done = ?, app_permit_close = ? WHERE app_acronym = ? ";
      await db
        .promise()
        .query(query, [
          JSON.stringify(app_permit_create),
          JSON.stringify(app_permit_toDoList),
          JSON.stringify(app_permit_doing),
          JSON.stringify(app_permit_done),
          JSON.stringify(app_permit_close),
          appId,
        ]);
      return res
        .status(200)
        .json({ message: "Application permissions successfully updated." });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
