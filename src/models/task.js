import { Model } from "sequelize";
import { task_status, task_priority } from "../utils/enums.js";

export default (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
      });
    }
  }

  Task.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      priority: DataTypes.ENUM(...task_priority),
      status: DataTypes.ENUM(...task_status),
      user_id: DataTypes.INTEGER,
      due_at: DataTypes.DATE
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Task"
    }
  );

  return Task;
};
