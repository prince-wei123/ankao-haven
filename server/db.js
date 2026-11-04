// SQLite initialization — runs once on start
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'haven.db');
const db = new Database(dbPath);
console.log('[db] ' + dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Schema ---
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    name TEXT,
    exam_date TEXT,
    first_visit TEXT DEFAULT (date('now','localtime')),
    last_visit  TEXT DEFAULT (date('now','localtime')),
    created_at  TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date     TEXT NOT NULL,
    mood_id  TEXT,
    char_id  TEXT,
    line_en  TEXT,
    line_cn  TEXT,
    accepted INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
  );

  CREATE TABLE IF NOT EXISTS focus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date     TEXT NOT NULL,
    minutes  INTEGER NOT NULL DEFAULT 0,
    subject  TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS favs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    char_id  TEXT,
    text_en  TEXT,
    text_cn  TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS letters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_who    TEXT,
    content   TEXT,
    sealed_at TEXT DEFAULT (datetime('now','localtime')),
    opened_at TEXT
  );

  CREATE TABLE IF NOT EXISTS capsules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content    TEXT,
    seal_days  INTEGER,
    sealed_at  TEXT DEFAULT (datetime('now','localtime')),
    open_at    TEXT,
    opened     INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS wall_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
    nickname   TEXT,
    content    TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS tiny (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date      TEXT NOT NULL,
    item0     TEXT, done0 INTEGER DEFAULT 0,
    item1     TEXT, done1 INTEGER DEFAULT 0,
    item2     TEXT, done2 INTEGER DEFAULT 0,
    cheered   INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
  );

  CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, date);
  CREATE INDEX IF NOT EXISTS idx_focus_user_date    ON focus(user_id, date);
  CREATE INDEX IF NOT EXISTS idx_wall_created       ON wall_posts(created_at DESC);
`);

module.exports = db;
