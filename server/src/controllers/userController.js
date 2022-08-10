const db = require("../config/database");
const argon2 = require("argon2");
const { mergeResults, compareGroups } = require("../utils/helpers");

const findUser = async (username) => {
  const query = `SELECT t1.id, t1.username, t1.email FROM users t1 WHERE username = ?`;
  const results = await db.promise().query(query, [username]);
  return results[0][0];
};

const findUserGroups = async (userid) => {
  const query = `SELECT t1.*, t2.name FROM assignment.user_groups t1 INNER JOIN assignment.groups t2 ON t1.group_id = t2.id`;
  const results = await db.promise().query(query, [userid]);
  return results[0];
};

/** Minimum 8 characters and maximum 10 characters
 Comprise of alphabets , numbers, and special characters */
const validPassword = (password) => {
  if (password.length < 8 || password.length > 10) return false; //check for password length
  if (!/[0-9]/g.test(password)) return false; //check for numbers
  if (!/[a-zA-Z]/.test(password)) return false; //check for alphabets
  if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return false; //check for special characters

  return true;
};

exports.getAllUsers = async (req, res) => {
  try {
    const query1 = `SELECT id, username, email, role, isActive FROM users`;
    const query2 = `SELECT t1.*, t2.name FROM assignment.user_groups t1 INNER JOIN assignment.groups t2 ON t1.group_id = t2.id`;
    const queryUsers = db.promise().query(query1);
    const queryGroups = db.promise().query(query2);
    const results = await Promise.all([queryUsers, queryGroups]);

    const userResults = results[0][0];
    const groupResults = results[1][0];
    const data = mergeResults(userResults, groupResults);
    res.status(200).json(data);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    db.query(
      "SELECT id, name, email, isActive FROM users WHERE id = ?",
      [req.params.id],
      function (err, results) {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(200).json(results);
        }
      }
    );
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, password, email, groups, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "A username and password is required." });
  }

  if (!validPassword(password)) {
    return res.status(400).json({
      message:
        "Password has to contain at least 8-10 characters, and at least an alphabet, number and special character.",
    });
  }

  try {
    /** check for existing user */
    const existingUser = await findUser(username);
    if (existingUser) {
      return res.status(401).json({ message: "Username already exists." });
    } else {
      /** If user does not exists */
      const hashedPassword = await argon2.hash(password);
      const query =
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID()"; //create new user and retrieve id
      const results = await db
        .promise()
        .query(query, [username, email, hashedPassword, role ? role : "user"]);

      const id = results[0][1][0]["LAST_INSERT_ID()"];
      if (groups) {
        const addGroups = groups.map(async (grp) => {
          const query = `INSERT INTO assignment.user_groups (user_id, group_id) VALUES (?, ?)`; //add groups
          db.promise().query(query, [id, grp]);
        });
        await Promise.all(addGroups);
      }

      return res.status(200).json({ message: "User successfully created" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  const username = req.user.username;
  try {
    const query = `SELECT * FROM users WHERE username = ? AND isActive = ?`;
    const results = await db.promise().query(query, [username, "1"]);
    const user = results[0][0];
    if (user) {
      user.password = undefined;

      return res.status(200).json(user);
    } else {
      return res.status(401).json({ message: "User profile not found." });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.updateMe = async (req, res) => {
  const username = req.user.username;
  const email = req.body.email;
  const password = req.body.password;

  if (password && !validPassword(password))
    return res.status(400).json({
      message:
        "Password has to contain at least 8-10 characters, and at least an alphabet, number and special character.",
    });

  try {
    if (email) {
      const query = `UPDATE users SET email = ? WHERE username = ?`;
      await db.promise().query(query, [email, username]);
    }

    if (password) {
      const hashedPassword = await argon2.hash(password);
      const query = `UPDATE users SET email = ? WHERE username = ?`;
      await db.promise().query(query, [hashedPassword, username]);
    }

    res.status(200).json({ message: "Your email has been updated." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const isActive = req.body.isActive;
  const email = req.body.email;
  const role = req.body.role;
  const groups = req.body.groups || []; //[groupId, groupId, groupId]
  const userGroups = req.body.userGroups || [];

  try {
    const query = `UPDATE users SET isActive = ?, email = ?, role = ? WHERE username = ?`;
    const updateUserDetails = db
      .promise()
      .query(query, [isActive, email, role, username]);

      /**returns a hashmap 
        {
          add: [groupId],
          remove: [groupId]
        }
      */
    const groupsQueries = compareGroups(userGroups, groups); 

    const addGroups = groupsQueries.add.map(async (grp) => {
      const query = `INSERT INTO assignment.user_groups (user_id, group_id) VALUES (?, ?)`;
      db.promise().query(query, [id, grp]);
    });

    const removeGroups = groupsQueries.remove.map(async (grp) => {
      const query = `DELETE FROM assignment.user_groups WHERE user_id = ? AND group_id = ?`;
      db.promise().query(query, [id, grp]);
    });

    await Promise.all([...addGroups, ...removeGroups, updateUserDetails]);
    return res.status(200).json({ message: "User successfully updated." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  const password = req.body.password;
  const username = req.body.username;

  if (!validPassword(password)) {
    return res.status(400).json({
      message:
        "Password has to contain at least 8-10 characters, and at least an alphabet, number and special character.",
    });
  }

  const hashedPassword = await argon2.hash(password);

  try {
    const query = `UPDATE users SET password = ? WHERE username = ?`;
    await db.promise().query(query, [hashedPassword, username]);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
