const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* GET ALL USERS */
router.get("/", (req, res) => {
  const sql = "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(result);
  });
});

/* DELETE USER */
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const deleteSessions = "DELETE FROM sessions WHERE user_id = ?";
  const deleteUser = "DELETE FROM users WHERE id = ?";

  db.query(deleteSessions, [userId], (sessionErr) => {
    if (sessionErr) {
      console.log(sessionErr);
      return res.status(500).json({ message: "Failed to delete user sessions" });
    }

    db.query(deleteUser, [userId], (userErr) => {
      if (userErr) {
        console.log(userErr);
        return res.status(500).json({ message: "Failed to delete user" });
      }

      res.json({ message: "User deleted successfully" });
    });
  });
});

/* UPDATE USER PROFILE */
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";

  db.query(sql, [name, email, userId], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to update profile"
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: userId,
        name,
        email
      }
    });
  });
});

module.exports = router;