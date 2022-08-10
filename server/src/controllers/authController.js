const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const SECRET_KEY = process.env.JWT_SECRET || "";

const signToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.username);

  //name, value, options for expiry time. httpOnly so not accessible from client
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + 24 * 60 * 60 * 1000 //24hrs
    ),
    httpOnly: true,
    secure: false,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    user: {...user, token}
  });
};

const findUser = async (username) => {
  const query = `SELECT * FROM users WHERE username = ?`;
  const results = await db.promise().query(query, [username]);
  return results[0][0];
};

exports.signup = async (req, res, next) => {
  const { username, password, email } = req.body;

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
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, "user"],
        function (err, results) {
          if (err) {
            res.status(400).json({ message: err.message });
          }
          createSendToken(results, 200, req, res);
        }
      );
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.login = async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res.status(401).json({ message: "Please enter a valid username and password" });

  try {
    const user = await findUser(username);

    if(!user) return res.status(401).json({ message: "Invalid username or password." });
    if (await argon2.verify(user.password, password)) {
      createSendToken(user, 200, req, res);
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res
    .clearCookie("jwt")
    .status(200)
    .json({ message: "You are successfully logged out." });
};

exports.protectedRoute = async (req, res, next) => {
  // 1) Check for token in the req headers or if token is sent as a cookie
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  //return if no token
  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in. Please login to gain access." });
  }

  // 2) Verify token authenticity
  const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);

  // 3) Check if user still exists
  const currentUser = await findUser(decodedToken.username);
  if (!currentUser) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exist ",
    });
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

exports.restrictMe = (req, res, next) => {
  if(req.user.username !== req.body.username) {
    return res.status(403).json({message: "You do not have permission to perform this actiona."})}
  next();
};

exports.restrictedRoute = (roles) => {
  return (req, res, next) => {
    // roles ['admin' || 'user']
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

