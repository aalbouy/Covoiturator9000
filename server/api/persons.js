const express = require("express");
const db = require("../db_handler");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, name, emoji, money, is_fav FROM persons WHERE is_hidden IS false"
    )
    .all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { name, emoji } = req.body;

  const insert = db.prepare("INSERT INTO persons (name, emoji) VALUES (?, ?)");
  const lastId = insert.run(name, emoji).lastInsertRowid;

  if (!lastId) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Success",
    data: { id: lastId },
  });
});

module.exports = router;
