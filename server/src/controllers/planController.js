const db = require("../config/database");
const { checkGroupName } = require("../utils/helpers");

const findPlan = async (planId) => {
  const query = `SELECT * FROM assignment.plans WHERE plan_mvp_name = ?`;
  const results = await db.promise().query(query, [planId]);
  return results[0][0];
};

exports.getAllPlans = async (req, res) => {
  try {
    const query = `SELECT * FROM assignment.plans`;
    const queryPlans = await db.promise().query(query);
    const results = queryPlans[0];
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

exports.getApplicationPlans = async (req, res) => {
    const app_acronym = req.params.appId
  try {
    const query = `SELECT * FROM assignment.plans WHERE plan_app_acronym = ?`;
    const queryPlans = await db.promise().query(query, [app_acronym]);
    const results = queryPlans[0];
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.createPlan = async (req, res) => {
  const { plan_mvp_name, plan_startDate, plan_endDate, plan_app_acronym, plan_color, plan_description } = req.body;

  if (plan_startDate > plan_endDate) {
    return res
      .status(400)
      .json({ message: "Starting Date cannot be later than End Date" });
  }

  try {
    /** check for existing application */
    const existingPlan = await findPlan(plan_mvp_name);
    const allowedUser = await checkGroupName(req.user.id, "manager");

    if (!allowedUser) {
      return res.status(401).json({
        message: "You do not have access rights to create a plan",
      });
    } else if (existingPlan) {
      return res.status(401).json({ message: "Plan name already exists." });
    } else {
      /** If application acronym is acceptable */
      const query =
        "INSERT INTO assignment.plans (plan_mvp_name, plan_startDate, plan_endDate, plan_app_acronym, plan_color, plan_description) VALUES (?, ?, ?, ?, ?, ?); ";
      await db
        .promise()
        .query(query, [plan_mvp_name, plan_startDate, plan_endDate, plan_app_acronym, plan_color, plan_description]);

      return res
        .status(200)
        .json({ message: "Plan successfully created" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
