import db from "../models/index.js";
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
  
      const { rows: tasks, count: total } = await Task.findAndCountAll({
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
    await Task.update(req.body, { where: { id: req.params.id } });

    res.json({ message: "Task updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
