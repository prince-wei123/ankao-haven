// PostgreSQL (Neon) —— 连接池 + 幂等建表
// 免费版 Neon 的每条连接都比较贵，所以池子开小一点（serverless 每个实例一个池）。
const { Pool } = require('pg');

const CONN = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

let pool = null;
let readyPromise = null;

function isConfigured() {
  return !!CONN;
}

function getPool() {
  if (!CONN) return null;
  if (pool) return pool;
  pool = new Pool({
    connectionString: CONN,
    ssl: { rejectUnauthorized: false },
    max: 4,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000
  });
  pool.on('error', (e) => console.error('[db] pool error:', e.message));
  return pool;
}

// 时间统一按上海时区存成 TEXT，格式与原来的 SQLite 一致：
// 日期 'YYYY-MM-DD'，时间戳 'YYYY-MM-DD HH:MM:SS'
const TZ = `'Asia/Shanghai'`;
const TODAY = `to_char(now() AT TIME ZONE ${TZ}, 'YYYY-MM-DD')`;
const NOW = `to_char(now() AT TIME ZONE ${TZ}, 'YYYY-MM-DD HH24:MI:SS')`;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    name TEXT,
    exam_date TEXT,
    first_visit TEXT DEFAULT ${TODAY},
    last_visit  TEXT DEFAULT ${TODAY},
    created_at  TEXT DEFAULT ${NOW}
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date     TEXT NOT NULL,
    minutes  INTEGER NOT NULL DEFAULT 0,
    subject  TEXT,
    created_at TEXT DEFAULT ${NOW}
  );

  CREATE TABLE IF NOT EXISTS favs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    char_id  TEXT,
    text_en  TEXT,
    text_cn  TEXT,
    created_at TEXT DEFAULT ${NOW}
  );

  CREATE TABLE IF NOT EXISTS letters (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_who    TEXT,
    content   TEXT,
    sealed_at TEXT DEFAULT ${NOW},
    opened_at TEXT
  );

  CREATE TABLE IF NOT EXISTS capsules (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content    TEXT,
    seal_days  INTEGER,
    sealed_at  TEXT DEFAULT ${NOW},
    open_at    TEXT,
    opened     INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS wall_posts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
    nickname   TEXT,
    content    TEXT NOT NULL,
    created_at TEXT DEFAULT ${NOW}
  );

  CREATE TABLE IF NOT EXISTS tiny (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
`;

async function init() {
  const p = getPool();
  if (!p) throw new Error('DATABASE_URL 未配置');
  await p.query(SCHEMA);
  console.log('[db] schema ready');
}

// 冷启动时只建表一次；失败后允许下次重试
function ready() {
  if (!readyPromise) {
    readyPromise = init().catch((err) => {
      readyPromise = null;
      throw err;
    });
  }
  return readyPromise;
}

async function query(sql, params) {
  const p = getPool();
  if (!p) {
    const err = new Error('DATABASE_URL 未配置');
    err.code = 'NO_DATABASE_URL';
    throw err;
  }
  await ready();
  return p.query(sql, params);
}

module.exports = { query, ready, isConfigured, getPool };
