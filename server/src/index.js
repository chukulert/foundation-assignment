require('dotenv').config()
const http = require("http");
const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const {db} = require("./config/database.js");
//  session from "express-session";
// console.log(db)

const PORT = process.env.PORT || 3000;

// Inititalize the server and add middleware
const server = express();
// const httpServer = http.createServer(server);
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
server.use(cookieParser())
// server.use(session({ secret: process.env.SESSION_SECRET })); // Session setup

/** Routes */
server.use("/users", userRoutes);

/** Error handling */
server.use((req, res, next) => {
  const error = new Error("No route found");

  res.status(404).json({
    message: error.message,
  });
});

/** Establish connection to database */
// const testConnection = async () => {
//   try {
//     await db.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// testConnection();

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});

