const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const groupController = require("../controllers/groupController")

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
// router.get("/leadusers", userController.getLeadUsers)

/** Routes after this are accessible on login */
router.use(authController.protectedRoute);

router.post("/logout", authController.logout);

router
  .route("/me")
  .get(userController.getMe)
  .patch(userController.updateMe);

  router.route("/allgroups") 
  .get(groupController.getAllGroups)
  .post(authController.restrictedRoute('admin'), groupController.createGroup) //route protected

/** Routes after this are protected by admin */
router.use(authController.restrictedRoute('admin'));

router.get("/all", userController.getAllUsers);
router.route("/createUser").post(userController.createUser);
router.route("/updateUser").patch(userController.updateUser);
router.route("/updatePassword").patch(userController.updateUserPassword);

module.exports = router;
