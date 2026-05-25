const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/stats", (req, res) => {
  const usersQuery = "SELECT COUNT(*) AS totalUsers FROM users";
  const sessionsQuery = "SELECT COUNT(*) AS totalSessions FROM sessions";

  db.query(usersQuery, (userErr, userResult) => {
    if (userErr) {
      return res.status(500).json({ message: "Database error" });
    }

    db.query(sessionsQuery, (sessionErr, sessionResult) => {
      if (sessionErr) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        totalUsers: userResult[0].totalUsers,
        totalSessions: sessionResult[0].totalSessions
      });
    });
  });
});

module.exports = router;