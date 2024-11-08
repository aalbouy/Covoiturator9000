const express = require("express");
const db = require("../db_handler");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM rides").all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { persons_id, price, preset_id } = req.body;

  let lastId;
  const price_per_person =
    Math.round((price / (persons_id.length + 1)) * 100) / 100;

  if (preset_id !== -1) {
    // Do not insert preset if none was selected
    const insert = db.prepare(
      "INSERT INTO rides (price, preset_id) VALUES (?, ?)"
    );
    lastId = insert.run(price, preset_id).lastInsertRowid;

    // Adding useto preset
    const update = db.prepare(
      "UPDATE presets SET nb_use = nb_use + 1 WHERE id = (?)"
    );
    const changes = update.run(preset_id).changes;
    if (!changes) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const insert = db.prepare("INSERT INTO rides (price) VALUES (?)");
    lastId = insert.run(price).lastInsertRowid;
  }

  if (!lastId) {
    return res.status(500).json({ error: err.message });
  }

  const ride_id = lastId;

  const person_ride_req = db.prepare(
    "INSERT INTO person_rides (person_id, ride_id) VALUES (?, ?)"
  );
  const person_add_money_req = db.prepare(
    "UPDATE persons SET money = money + " + price_per_person + " WHERE id = (?)"
  );
  persons_id.forEach((id) => {
    lastId = person_ride_req.run(id, ride_id).lastInsertRowid;
    if (!lastId) {
      return res.status(500).json({ error: err.message });
    }
    let changes = person_add_money_req.run(id).changes;
    if (!changes) {
      return res.status(500).json({ error: err.message });
    }
  });

  res.json({
    message: "Success",
    data: { id: lastId },
  });
});

router.get("/complete", (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.id AS pers_id, p.name AS pers_name, r.id AS ride_id, 
       r.date, r.price, p2.name AS preset
       FROM  person_rides
       INNER JOIN persons p ON person_id = p.id
       INNER JOIN rides r ON ride_id = r.id
       LEFT JOIN presets p2 ON r.preset_id  = p2.id`
    )
    .all();
  res.json(rows);
});

module.exports = router;
