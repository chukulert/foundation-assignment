const express = require("express");
const authController = require("../controllers/authController");
const planController = require("../controllers/planController");
const applicationController = require("../controllers/applicationController");
const taskController = require("../controllers/taskController");

const router = express.Router();

/** Routes after this are accessible on login */
router.use(authController.protectedRoute);

/** Application routes */
router
  .route("/applications")
  .get(applicationController.getAllApplications)
  .post(applicationController.createApplication);

router
.route("/applications/:appId")
.patch(applicationController.editApplication)

/** Plan routes */
router.route("/plans").get(planController.getAllPlans);

router
  .route("/:appId/plans")
  .get(planController.getApplicationPlans)
  .post(planController.createPlan);

  // router
  // .route("/:planId/plans")
  // .patch()

/** Task routes */
router.route("/tasks").get(taskController.getAllTasks);
router.route("/tasks/:taskId").get(taskController.findTask)
router.route("/:taskId/promoteToDone").patch(taskController.promoteTaskToDone)

router.route("/getTasks").get(taskController.getTaskByState)

router
  .route("/:appId")
  .get(taskController.getAllApplicationTasks)
  .post(taskController.createTask);

router
  .route("/:appId/:taskId")
  .post(taskController.editTask)
  .patch(taskController.updateTaskState);

router
  .route("/:appId/:taskId/email")
  .post(taskController.sendEmailNotification);

module.exports = router;
