import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { tokenBlacklist } from "../utils/tokenBlacklist.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token invalidated (logged out)" });
  }

  jwt.verify(token, config.ACCESS_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = decoded; // id, email, role
    next();
  });
};

export const checkOwnership = (req, res, next) => {
  const requestedId = parseInt(req.params.id);
  const loggedInId = req.user.id;
  const role = req.user.role;

  if (role === "admin") return next();

  if (requestedId !== loggedInId)
    return res.status(403).json({ message: "Access denied" });

  next();
};
