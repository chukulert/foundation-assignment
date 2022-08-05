const db = require("../config/database");
const argon2 = require("argon2");

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

// exports.getMe = async (req, res) => {
//     try {
//       const user = await User.update(req.body, {
//         where: {
//           id: req.session.user.id,
//         },
//       });
//       res.status(200).json(user);
//     } catch (error) {
//       res.json({ message: error.message });
//     }
//   };

exports.updateMe = async (req, res) => {
  try {
    const user = await User.update(req.body, {
      where: {
        id: req.session.user.id,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const findUser = async (username) => {
  const query = `SELECT * FROM users WHERE username = ?`;
  const results = await db.promise().query(query, [username]);
  return results[0][0];
};

exports.updateUser = async (req, res) => {
  const username = req.body.username;
  const isActive = req.body.isActive;
  const email = req.body.email;

  try {
    const query = `UPDATE users SET isActive = ?, email = ? WHERE username = ? RETURNING email`;
    await db.promise().query(query, [
      isActive,
      email,
      username
    ]);
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
    res.status(200).json({message: "success"})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//signup method is in authcontroller

// const userController = { updateMe, getAllUsers, getUserById, updateUser, disableUser }

