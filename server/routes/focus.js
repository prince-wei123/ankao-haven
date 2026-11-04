const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// GET /api/focus?days=7
router.get('/', authRequired, (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 365);
  const rows = db.prepare(
    `SELECT date, COALESCE(SUM(minutes), 0) AS minutes
     FROM focus WHERE user_id = ?
     AND date >= date('now','localtime', ?)
     GROUP BY date ORDER BY date DESC`
  ).all(req.user.id, `-${days} days`);

  const total = db.prepare(
    'SELECT COALESCE(SUM(minutes), 0) AS m FROM focus WHERE user_id = ?'
  ).get(req.user.id).m;

  const today = fmt(new Date());
  const todayMin = rows.find(r => r.date === today)?.minutes || 0;

  res.json({
    rows: rows.map(r => ({ date: r.date, minutes: r.minutes })),
    total,
    today: todayMin
  });
});

// POST /api/focus — add focus record
router.post('/', authRequired, (req, res) => {
  const { date, minutes, subject } = req.body || {};
  const d = date || fmt(new Date());
  const m = parseInt(minutes) || 0;
  if (m <= 0) return res.status(400).json({ error: 'invalid_minutes' });

  const info = db.prepare(
    'INSERT INTO focus (user_id, date, minutes, subject) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, d, m, subject || null);

  res.json({ ok: true, id: info.lastInsertRowid });
});

// DELETE /api/focus/:id — remove a record
router.delete('/:id', authRequired, (req, res) => {
  const info = db.prepare('DELETE FROM focus WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  res.json({ ok: true, changes: info.changes });
});

function fmt(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

module.exports = router;
