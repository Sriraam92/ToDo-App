export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("Tasks", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    title: {
      type: Sequelize.STRING,
      allowNull: false
    },

    description: {
      type: Sequelize.TEXT,
    },

    priority: {
      type: Sequelize.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },

    status: {
      type: Sequelize.ENUM("pending", "completed", "overdue"),
      defaultValue: "pending",
    },

    due_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW 
    }
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable("Tasks");
};
