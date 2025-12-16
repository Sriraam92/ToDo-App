import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import config from "../config/config.js";
import { tokenBlacklist } from "../utils/tokenBlacklist.js";
import { markOverdueTasks } from "../utils/markOverdueTasks.js";

const { User, Task } = db;

const signAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.ACCESS_SECRET,
    { expiresIn: config.ACCESS_EXPIRES_IN }
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { id: user.id },
    config.REFRESH_SECRET,
    { expiresIn: config.REFRESH_EXPIRES_IN }
  );

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
      refreshToken: null
    });

    res.json({ message: "Signup successful", userId: user.id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    await markOverdueTasks(user.id);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await User.update({ refreshToken }, { where: { id: user.id } });

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user_id: user.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const user = await User.findOne({ where: { refreshToken } });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, config.REFRESH_SECRET, (err) => {
      if (err)
        return res.status(403).json({ message: "Expired refresh token" });

      const newAccessToken = signAccessToken(user);
      return res.json({ accessToken: newAccessToken });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];

    await User.update(
      { refreshToken: null },
      { where: { refreshToken } }
    );

    if (accessToken) {
      tokenBlacklist.add(accessToken);
    }

    res.json({ message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"]
    });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
