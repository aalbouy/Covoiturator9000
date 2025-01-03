CREATE TABLE IF NOT EXISTS persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT,
    money REAL DEFAULT 0 NOT NULL,
    is_fav BOOLEAN DEFAULT 0 NOT NULL,
    is_hidden BOOLEAN DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    nb_use INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS rides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP  NOT NULL,
    preset_id INTEGER,  -- Nullable foreign key to presets table
    price REAL NOT NULL,
    FOREIGN KEY (preset_id) REFERENCES presets(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS person_rides (
    person_id INTEGER NOT NULL,
    ride_id INTEGER NOT NULL,
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    PRIMARY KEY (person_id, ride_id)
);