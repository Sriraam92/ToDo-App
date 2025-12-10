import app from "./src/routes/index.js";
import { sequelize } from './src/models/index.js';

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => console.log("📌 DB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

sequelize.sync()
  .then(() => {
    console.log("📁 Models synced");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Sync Error:", err));
