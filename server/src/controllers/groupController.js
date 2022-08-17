const db = require("../config/database");

const findGroup = async (groupName) => {
  const query = `SELECT * FROM assignment.groups WHERE name = ?`;
  const results = await db.promise().query(query, [groupName]);
  return results[0][0];
};

exports.getAllGroups = async (req, res, next) => {
  try {
    const query = `SELECT * FROM assignment.groups`;
    const queryUsers = await db.promise().query(query);
    const results = queryUsers[0];
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "A group name is required." });
  }

  try {
    /** check for existing group name */
    const existingGroup = await findGroup(name);
    if (existingGroup) {
      return res.status(401).json({ message: "Group name already exists." });
    } else {
      /** If group name is available */
      const query = "INSERT INTO assignment.groups (name) VALUES (?);";
      await db.promise().query(query, [name]);

      return res.status(200).json({ message: "Group successfully created" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
