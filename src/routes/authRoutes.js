import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  getUserProfile,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup); //
router.post("/login", login); //
router.post("/refresh", refreshToken); //
router.post("/logout", logout); //

router.get("/profile", authMiddleware, getUserProfile); //

export default router;
