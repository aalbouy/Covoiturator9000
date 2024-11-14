const express = require("express");
const db = require("../db_handler");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM presets ORDER BY nb_use DESC").all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { name, price } = req.body;

  const insert = db.prepare("INSERT INTO presets (name, price) VALUES (?, ?)");
  const lastId = insert.run(name, price).lastInsertRowid;

  if (!lastId) {
    return res.status(500).json({ error: err.message });
  }

  res.json({
    message: "Success",
    data: { id: lastId },
  });
});

router.post("/update", (req, res) => {
  const { id, name, price } = req.body;

  const update = db.prepare("UPDATE presets SET name = (?), price = (?) WHERE id = (?)");
  const changes = update.run(name, price, id).changes;

  if (!changes) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Success"
  });
})

router.post("/delete", (req, res) => {
  const { id } = req.body;

  const update = db.prepare("DELETE FROM presets WHERE id = (?);");
  const changes = update.run(id).changes;

  if (!changes) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Success"
  });
})


module.exports = router;
