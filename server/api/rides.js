const express = require("express");
const db = require("../db_handler");

const router = express.Router();

// function insertPersonRideId(persons_ids, ride_id)
// {
//     // Begin a transaction to insert multiple rows efficiently
//     db.serialize(() => {
//       // Start a transaction
//       db.run("BEGIN TRANSACTION");

//       // Prepare the SQL statement for inserting into the table
//       const stmt = db.prepare("INSERT INTO person_rides (person_id, ride_id) VALUES (?, ?)");

//       // Loop through each person_id and insert with the same ride_id
//       persons_ids.forEach(persons_ids => {
//         stmt.run(persons_ids, ride_id);
//       });

//       // Finalize the statement and commit the transaction
//       stmt.finalize();
//       db.run("COMMIT");
//     });

// }

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM rides").all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { persons_id, price, preset_id } = req.body;

  let lastId;
    const price_per_person = Math.round(price / (persons_id.length + 1) * 100) / 100;
    console.log(price_per_person)

  if (preset_id !== -1) { // Do not insert preset if none was selected
    const insert = db.prepare("INSERT INTO rides (price, preset_id) VALUES (?, ?)");
    lastId = insert.run(price, preset_id).lastInsertRowid;
  } else {
    const insert = db.prepare("INSERT INTO rides (price) VALUES (?)");
    lastId = insert.run(price).lastInsertRowid;
  }

  if (!lastId) {
    return res.status(500).json({ error: err.message });
  }

  const ride_id = lastId;

  const person_ride_req = db.prepare("INSERT INTO person_rides (person_id, ride_id) VALUES (?, ?)");
  const person_add_money_req = db.prepare("UPDATE persons SET money = money + " + price_per_person + " WHERE id = (?)");
  persons_id.forEach(id => {
    lastId = person_ride_req.run(id, ride_id).lastInsertRowid;
    if (!lastId) {
      return res.status(500).json({ error: err.message });
    }
    lastId = person_add_money_req.run(id).lastInsertRowid;
    if (!lastId) {
      return res.status(500).json({ error: err.message });
    }
  });

  res.json({
    message: "Success",
    data: { id: lastId },
  });
});

module.exports = router;
