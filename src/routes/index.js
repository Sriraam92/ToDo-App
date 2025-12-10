import express from "express";
import bodyParser from "body-parser";

// Routes
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import adminRoutes from "./adminRoutes.js";

const app = express();

app.use(bodyParser.json());

/* ------------------ ROUTE MOUNTING ------------------ */

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

/* ------------------ 404 HANDLER ------------------ */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ------------------ GLOBAL ERROR HANDLER ------------------ */

app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
