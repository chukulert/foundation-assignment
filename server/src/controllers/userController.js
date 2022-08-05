const db = require("../config/database");
const argon2 = require("argon2");

const findUser = async (username) => {
  const query = `SELECT * FROM users WHERE username = ?`;
  const results = await db.promise().query(query, [username]);
  return results[0][0];
};

const findUserGroups = async(userid) => {
    const query = `SELECT * FROM assignment.groups t1 INNER JOIN assignment.user_groups t2 ON t1.id = t2.group_id INNER JOIN assignment.users t3 ON t2.user_id = t3.id WHERE t3.id = ?`
    const results = await db.promise().query(query, [userid]);
    return results[0]
}

exports.getAllUsers = (req, res) => {
  try {
    db.query(
      "SELECT id, username, email, isActive FROM users",
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

exports.createUser = async (req, res, next) => {
  const { username, password, email, groups, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "A username and password is required." });
  }

  try {
    /** check for existing user */
    const existingUser = await findUser(username);
    if (existingUser) {
      return res.status(401).json({ message: "Username already exists." });
    } else {
      /** If user does not exists */
      const hashedPassword = await argon2.hash(password);
      db.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID()",
        [username, email, hashedPassword, role ? role : "user"],
        function (err, results) {
          if (err) {
            res.status(400).json({ message: err.message });
          }
          return res
            .status(200)
            .json({ message: "User successfully created." });
        }
      );
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await findUser(req.user.username);
    const userGroups = await findUserGroups(req.user.id)
    console.log(userGroups)
    if (user) {
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
  try {
    const query = `UPDATE users SET email = ? WHERE username = ?`;
    await db.promise().query(query, [email, username]);
    res.status(200).json({message: "Your email has been updated."});
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const username = req.body.username;
  const isActive = req.body.isActive;
  const email = req.body.email;

  try {
    const query = `UPDATE users SET isActive = ?, email = ? WHERE username = ?`;
    await db.promise().query(query, [isActive, email, username]);
    return res.status(200).json({ message: `success` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const hashedPassword = await argon2.hash(password);

  try {
    const query = `UPDATE users SET password = ? WHERE username = ?`;
    await db.promise().query(query, [hashedPassword, username]);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//signup method is in authcontroller

// const userController = { updateMe, getAllUsers, getUserById, updateUser, disableUser }
