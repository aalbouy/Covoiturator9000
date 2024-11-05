const express = require("express");
const db = require("../db_handler");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM presets").all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { name, price } = req.body;

  const insert = db.prepare("INSERT INTO presets (name, price) VALUES (?, ?)");
  const lastId = insert.run(name, price).lastInsertRowid;

  if (!lastId) {
    return res.status(500).json({ error: err.message });
  }
  console.log(lastId)
  res.json({
    message: "Success",
    data: { id: lastId },
  });
});

// let req = `INSERT INTO presets (name, money) VALUES ('🍔 BK ', 3.21)`;
// db.run(req, function (err) {
//   if (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
