// Authentication middleware — anonymous token in Authorization header
const { nanoid } = require('nanoid');
const db = require('../db');

function generateUserId() {
  return nanoid(10); // e.g. V1StGXR8_Z5jdHi6B-myT
}

function authOptional(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return next();
  const row = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
  if (row) {
    db.prepare('UPDATE users SET last_visit = date(\'now\',\'localtime\') WHERE id = ?').run(row.id);
    req.user = row;
  }
  next();
}

function authRequired(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'no_token' });
  let row = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
  if (!row) {
    // auto-create
    const id = generateUserId();
    const newToken = nanoid(24);
    db.prepare('INSERT INTO users (id, token) VALUES (?, ?)').run(id, newToken);
    row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    req.user = row;
    return next();
  }
  db.prepare('UPDATE users SET last_visit = date(\'now\',\'localtime\') WHERE id = ?').run(row.id);
  req.user = row;
  next();
}

module.exports = { authOptional, authRequired, generateUserId };
