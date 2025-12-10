import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

import {
  getAllUsersAdmin,
  getAllUserTasksAdmin,
  getAllTasksAdmin,
  deleteUserTaskAdmin,
  deleteUserTasksAdmin,
  deleteUserAdmin
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/users", getAllUsersAdmin); //
router.get("/:id/tasks", getAllUserTasksAdmin); 
router.get("/tasks", getAllTasksAdmin); 

router.delete("/users/:id/tasks/:tid", deleteUserTaskAdmin); //
router.delete("/users/:id/tasks/", deleteUserTasksAdmin); //
router.delete("/users/:id", deleteUserAdmin); //

export default router;
