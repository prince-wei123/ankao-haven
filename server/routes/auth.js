const express = require('express');
const { nanoid } = require('nanoid');
const { query } = require('../db');
const { ah, todayStr } = require('../util');

const router = express.Router();

// POST /api/auth/anonymous — create anonymous user, return token
router.post('/anonymous', ah(async (req, res) => {
  const id = nanoid(10);
  const token = nanoid(24);
  await query('INSERT INTO users (id, token) VALUES ($1, $2)', [id, token]);
  res.json({ user: { id, token, name: null, exam_date: null }, firstVisit: todayStr() });
}));

// GET /api/auth/me — verify token, return user profile
router.get('/me', ah(async (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.json({ user: null });
  const { rows } = await query('SELECT * FROM users WHERE token = $1', [token]);
  const row = rows[0];
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
}));

module.exports = router;
