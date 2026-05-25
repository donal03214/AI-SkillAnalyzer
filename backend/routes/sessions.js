const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* CREATE SESSION */
router.post("/create", (req, res) => {
  const { user_id, title, type, score } = req.body;

  if (!user_id || !title || !type) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  const sql =
    "INSERT INTO sessions (user_id, title, type, score) VALUES (?, ?, ?, ?)";

  db.query(sql, [user_id, title, type, score || 0], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json({
      message: "Session saved successfully"
    });
  });
});

/* GET USER SESSIONS */
router.get("/:user_id", (req, res) => {
  const sql =
    "SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [req.params.user_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(result);
  });
});

/* GET ALL SESSIONS FOR ADMIN */
router.get("/admin/all", (req, res) => {
  const sql = `
    SELECT 
      sessions.id,
      sessions.title,
      sessions.type,
      sessions.score,
      sessions.created_at,
      users.name,
      users.email
    FROM sessions
    JOIN users ON sessions.user_id = users.id
    ORDER BY sessions.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(result);
  });
});

/* DELETE SESSION */
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM sessions WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to delete session"
      });
    }

    res.json({
      message: "Session deleted successfully"
    });
  });
});

module.exports = router;