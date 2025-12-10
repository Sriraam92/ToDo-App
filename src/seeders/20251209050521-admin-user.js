import bcrypt from "bcrypt";
import { Op } from "sequelize";

export async function up(queryInterface, Sequelize) {
  const passwordHash1 = await bcrypt.hash("Admin@123", 10);
  const passwordHash2 = await bcrypt.hash("Admin@234", 10);

  return queryInterface.bulkInsert("Users", [
    {
      name: "Admin1",
      email: "admin1@admin.com",
      password: passwordHash1,
      role: "admin",
      refreshToken: null
    },
    {
      name: "Admin2",
      email: "admin2@admin.com",
      password: passwordHash2,
      role: "admin",
      refreshToken: null
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("Users", {
    email: {
      [Op.in]: ["admin1@admin.com", "admin2@admin.com"]
    }
  });
}

