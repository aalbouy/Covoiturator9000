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

router.post("/favorite", (req, res) => {
  const { id, is_fav } = req.body;

  const update = db.prepare("UPDATE persons SET is_fav = (?) WHERE id = (?)");
  const changes = update.run(+is_fav, id).changes;

  if (!changes) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Success"
  });
});

router.post("/update", (req, res) => {
  const { id, name, emoji } = req.body;

  const update = db.prepare("UPDATE persons SET name = (?), emoji = (?) WHERE id = (?)");
  const changes = update.run(name, emoji, id).changes;

  if (!changes) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Success"
  });
})

router.post("/refund", (req, res) => {
  const { id } = req.body;

  const update = db.prepare("UPDATE persons SET money = 0 WHERE id = (?)");
  const changes = update.run(id).changes;

  if (!changes) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Success"
  });
})

router.post("/delete", (req, res) => {
  const { id } = req.body;

  const update = db.prepare("UPDATE persons SET is_hidden = true WHERE id = (?)");
  const changes = update.run(id).changes;

  if (!changes) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Success"
  });
})

module.exports = router;
