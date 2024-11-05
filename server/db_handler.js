const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbFile = "kovoiturator.db";
const schemaFile = path.join(__dirname, "schema.sql");

let db;

// Open a connection to the SQLite database
try {
  db = new Database(dbFile);
} catch (error) {
  console.error("Failed to open database:", error);
  process.exit(1);
}

// Close the database connection when the server shuts down
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

// Read the schema file and execute it
fs.readFile(schemaFile, "utf8", (err, sql) => {
  if (err) {
    console.error("Could not read schema file", err.message);
    return;
  }

  // Execute the SQL script
  db.exec(sql);

  console.log("DB Initialized");
});

module.exports = db;
