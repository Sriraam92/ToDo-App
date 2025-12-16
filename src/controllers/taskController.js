import db from "../models/index.js";
import { calculateStatusFromDueDate } from "../utils/taskStatus.js";
const { Task } = db;

export const createTask = async (req, res) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id,
      status: req.body.status || "pending"
    };

    const task = await Task.create(data);
    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
      const userId = req.user.id;
      const { page = 1, limit = 10, sortBy = "id", order = "ASC", priority, status, search } = req.query;

      const offset = (page - 1) * limit;

      const where = { user_id: userId};
  
      if (priority) {
        where.priority = priority;
      }
  
      if (status) {
        where.status = status;
      }
  
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { desc: { [Op.iLike]: `%${search}%` } }
        ];
      }
  
      const { rows: tasks, count: total } = await Task.findAndCountAll({
        attributes: ["id", "user_id", "title", "description", "priority", "status", "due_at"],
        where,
        order: [[sortBy, order.toUpperCase()]],
        limit: parseInt(limit),
        offset
      });
  
      const totalPages = Math.ceil(total / limit);
  
      res.json({
        page: Number(page),
        totalPages,
        data: tasks
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_at, priority } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (due_at !== undefined) task.due_at = due_at;
    if (priority !== undefined) task.priority = priority;

    // Recalculate status ONLY if not completed
    if (task.status !== "completed") {
      task.status = calculateStatusFromDueDate(task.due_at);
    }

    await task.save();

    return res.json({ message: "Task updated" });

  } catch (err) {
    console.error("Update task error:", err);
    return res.status(500).json({ message: "Failed to update task" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "completed" or "pending"

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (status === "completed") {
      task.status = "completed";
    } 
    else if (status === "pending") {
      task.status = calculateStatusFromDueDate(task.due_at);
    } 
    else {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await task.save();

    return res.json({ message: "Task status updated" });

  } catch (err) {
    console.error("Update task status error:", err);
    return res.status(500).json({ message: "Failed to update task status" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });

    res.json({ message: "Task deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
