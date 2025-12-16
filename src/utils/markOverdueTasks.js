import db from "../models/index.js";

const { Task } = db;

export const markOverdueTasks = async (userId) => {
  const tasks = await Task.findAll({
    where: { user_id: userId }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const task of tasks) {
    
    if (task.status === "completed") continue;

    if (!task.due_at) {
      if (task.status !== "pending") {
        await task.update({ status: "pending" });
      }
      continue;
    }

    const dueDate = new Date(task.due_at);
    dueDate.setHours(0, 0, 0, 0);

    const newStatus = dueDate < today ? "overdue" : "pending";

    if (task.status !== newStatus) {
      await task.update({ status: newStatus });
    }
  }
};
