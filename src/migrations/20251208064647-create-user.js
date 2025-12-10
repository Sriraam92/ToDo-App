export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("Users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.TEXT,
    },
    refreshToken: {
      type: Sequelize.TEXT,
    },
    role: {
      type: Sequelize.ENUM("admin", "user"),
      defaultValue: "user",
    }
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable("Users");
};
