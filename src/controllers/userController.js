import bcrypt from "bcrypt";
import db from "../models/index.js";
const { User, Task } = db;

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "role"]
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "User updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeUserPass = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const newHash = await bcrypt.hash(newPass, 10);

    await User.update(
      { passwordHash: newHash },
      { where: { id: userId } }
    );

    return res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
