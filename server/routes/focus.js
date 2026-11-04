const express = require('express');
const { query } = require('../db');
const { authRequired } = require('../middleware/auth');
const { ah, todayStr } = require('../util');

const router = express.Router();

// GET /api/focus?days=7
router.get('/', authRequired, ah(async (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 365);
  const since = todayStr(new Date(Date.now() - days * 86400000));

  const { rows } = await query(
    `SELECT date, COALESCE(SUM(minutes), 0)::int AS minutes
     FROM focus WHERE user_id = $1
     AND date >= $2
     GROUP BY date ORDER BY date DESC`,
    [req.user.id, since]
  );

  const total = (await query(
    'SELECT COALESCE(SUM(minutes), 0)::int AS m FROM focus WHERE user_id = $1',
    [req.user.id]
  )).rows[0].m;

  const today = todayStr();
  const todayMin = rows.find(r => r.date === today)?.minutes || 0;

  res.json({
    rows: rows.map(r => ({ date: r.date, minutes: r.minutes })),
    total,
    today: todayMin
  });
}));

// POST /api/focus — add focus record
router.post('/', authRequired, ah(async (req, res) => {
  const { date, minutes, subject } = req.body || {};
  const d = date || todayStr();
  const m = parseInt(minutes) || 0;
  if (m <= 0) return res.status(400).json({ error: 'invalid_minutes' });

  const { rows } = await query(
    'INSERT INTO focus (user_id, date, minutes, subject) VALUES ($1, $2, $3, $4) RETURNING id',
    [req.user.id, d, m, subject || null]
  );

  res.json({ ok: true, id: rows[0].id });
}));

// DELETE /api/focus/:id — remove a record
router.delete('/:id', authRequired, ah(async (req, res) => {
  const result = await query('DELETE FROM focus WHERE id = $1 AND user_id = $2',
    [parseInt(req.params.id, 10), req.user.id]);
  res.json({ ok: true, changes: result.rowCount });
}));

module.exports = router;
