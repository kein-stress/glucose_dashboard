const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'workouts.sqlite');

if (DB_PATH !== ':memory:') {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new DatabaseSync(DB_PATH);
if (DB_PATH !== ':memory:') {
  db.exec('PRAGMA journal_mode = WAL');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL DEFAULT 'manual',
    category TEXT NOT NULL CHECK (category IN ('strength', 'cardio', 'mobility', 'other')),
    tags TEXT NOT NULL DEFAULT '[]',
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    intensity INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`);

module.exports = db;
