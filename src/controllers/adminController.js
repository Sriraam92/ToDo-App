import db from "../models/index.js";
const { User, Task } = db;

import { Op } from "sequelize";

export const getAllUsersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 3, sortBy = "id", order = "ASC", role, search } = req.query;

    // Paging
    const offset = (page - 1) * limit;

    // Filter
    const where = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: users, count: total } = await User.findAndCountAll({
      attributes: ["id", "name", "email", "role"],
      where,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      page: Number(page),
      totalPages,
      data: users
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUserTasksAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { page = 1, limit = 3, sortBy = "id", order = "ASC", priority, status, search } = req.query;

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

    const { rows: tasks, count: total } = await User.findAndCountAll({
      attributes: ["id", "user_id", "title", "priority", "status", "due_at"],
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


export const getAllTasksAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 3, sortBy = "id", order = "ASC", priority, status, search } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

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

    const { rows: tasks, count: total } = await User.findAndCountAll({
      attributes: ["id", "user_id", "title", "priority", "status", "due_at"],
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

export const deleteUserAdmin = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    await Task.destroy({ where: { user_id: req.params.id } });

    res.json({ message: "User and all related data deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserTaskAdmin = async (req, res) => {
  try {
    const { id, tid } = req.params;   // id = user_id, tid = task_id

    const deleted = await Task.destroy({
      where: {
        id: tid,
        user_id: id
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Task not found or does not belong to this user" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserTasksAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await Task.destroy({
      where: {
        user_id: userId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Task not found or does not belong to this user" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

