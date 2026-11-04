const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db');

const router = express.Router();

// POST /api/auth/anonymous — create anonymous user, return token
router.post('/anonymous', (req, res) => {
  const id = nanoid(10);
  const token = nanoid(24);
  db.prepare('INSERT INTO users (id, token) VALUES (?, ?)').run(id, token);
  res.json({ user: { id, token, name: null, exam_date: null }, firstVisit: todayStr() });
});

// GET /api/auth/me — verify token, return user profile
router.get('/me', (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.json({ user: null });
  const row = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
  if (!row) return res.json({ user: null });
  res.json({
    user: {
      id: row.id,
      token: row.token,
      name: row.name,
      exam_date: row.exam_date,
      firstVisit: row.first_visit,
      lastVisit: row.last_visit
    }
  });
});

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

module.exports = router;
