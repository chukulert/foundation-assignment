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

/** Plan routes */
router
  .route("/:appId/plans")
  .get(planController.getAllPlans)
  .post(planController.createPlan);

/** Task routes */
router
  .route("/:appId")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:appId/:taskId")
//   .post(taskController.addTaskNotes)
  .patch(taskController.updateTaskState);

module.exports = router;
