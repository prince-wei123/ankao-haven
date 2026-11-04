// Authentication middleware — anonymous token in Authorization header
const { nanoid } = require('nanoid');
const { query } = require('../db');
const { todayStr } = require('../util');

function generateUserId() {
  return nanoid(10); // e.g. V1StGXR8_Z5jdHi6B-myT
}

function readToken(req) {
  return (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
}

async function touch(userId) {
  await query('UPDATE users SET last_visit = $1 WHERE id = $2', [todayStr(), userId]);
}

// 可选登录：有 token 且能查到用户就挂到 req.user 上，否则当游客
async function authOptional(req, res, next) {
  try {
    const token = readToken(req);
    if (!token) return next();
    const { rows } = await query('SELECT * FROM users WHERE token = $1', [token]);
    if (rows[0]) {
      await touch(rows[0].id);
      req.user = rows[0];
    }
    next();
  } catch (err) {
    next(err);
  }
}

// 必须登录：token 查不到时自动建一个匿名用户（沿用客户端给的 token）
async function authRequired(req, res, next) {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ error: 'no_token' });

    const { rows } = await query('SELECT * FROM users WHERE token = $1', [token]);
    let row = rows[0];

    if (!row) {
      const id = generateUserId();
      const inserted = await query(
        'INSERT INTO users (id, token) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        [id, token]
      );
      row = inserted.rows[0] || (await query('SELECT * FROM users WHERE token = $1', [token])).rows[0];
      req.user = row;
      return next();
    }

    await touch(row.id);
    req.user = row;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authOptional, authRequired, generateUserId };
