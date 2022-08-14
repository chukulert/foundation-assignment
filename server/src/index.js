require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const PORT = process.env.PORT || 3000;

// Inititalize the server and add middleware
const server = express();
// const httpServer = http.createServer(server);
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
server.use(cookieParser());

/** Routes */
server.use("/users", userRoutes);
server.use("/tasks", taskRoutes);

/** Error handling */
server.use((req, res, next) => {
  const error = new Error("No route found");

  res.status(404).json({
    message: error.message,
  });
});

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
