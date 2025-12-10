import db from "../models/index.js";
const { Task } = db;

export const checkTaskOwner = async (req, res, next) => {
  const task = await Task.findByPk(req.params.id);

  if (!task)
    return res.status(404).json({ message: "Task not found" });

  if (req.user.role === "admin") return next();

  if (task.user_id !== req.user.id)
    return res.status(403).json({ message: "Not your task" });
  
  next();
};