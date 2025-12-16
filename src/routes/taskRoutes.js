import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} from "../controllers/taskController.js";

import { authMiddleware, checkOwnership } from "../middleware/authMiddleware.js";
import { checkTaskOwner } from "../middleware/taskOwnershipMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTask); //
router.get("/", authMiddleware, getAllTasks); //
router.get("/:id", checkTaskOwner, getTaskById); //
router.patch("/:id", checkTaskOwner, updateTask); //
router.patch("/:id/status", checkTaskOwner, updateTaskStatus);
router.delete("/:id", checkTaskOwner, deleteTask); //

export default router;
