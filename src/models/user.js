import { Model } from "sequelize";
import { user_roles } from "../utils/enums.js";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
      });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      refreshToken: DataTypes.TEXT,
      role: DataTypes.ENUM(...user_roles)
    },
    {
      sequelize,
      timestamps: false,
      modelName: "User"
    }
  );

  return User;
};
