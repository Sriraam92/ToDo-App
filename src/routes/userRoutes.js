import express from "express";
import {
  getUserById,
  updateUser,
  deleteUser,
  changeUserPass
} from "../controllers/userController.js";

import { authMiddleware, checkOwnership } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, checkOwnership, getUserById); //
router.put("/:id", authMiddleware, checkOwnership, updateUser); // 
router.delete("/:id", authMiddleware, checkOwnership, deleteUser); //
router.post("/:id/changepassword",authMiddleware, checkOwnership, changeUserPass); //

export default router;
