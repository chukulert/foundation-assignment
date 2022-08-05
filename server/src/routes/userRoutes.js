const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

/** Routes after this are accessible on login */
// router.use(authController.protectedRoute);
router.post("/logout", authController.logout);

router
  .route("/me")
  // .get(userController.getMe)
  .patch(userController.updateMe);

/** Routes after this are protected by admin */
// router.use(authController.restrictedRoute);
router.get("/all", userController.getAllUsers);

router.route("/updateUser").patch(userController.updateUser);
router.route("/updatePassword").patch(userController.updateUserPassword);

// router
//   .route("/:id")
//   .get(userController.getUserById)

module.exports = router;
