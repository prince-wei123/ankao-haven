const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// GET /api/checkins?limit=30
router.get('/', authRequired, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 30, 365);
  const rows = db.prepare(
    'SELECT * FROM checkins WHERE user_id = ? ORDER BY date DESC LIMIT ?'
  ).all(req.user.id, limit);
  res.json({ checkins: rows.map(r => ({
    id: r.id,
    date: r.date,
    moodId: r.mood_id,
    charId: r.char_id,
    line: { en: r.line_en, cn: r.line_cn },
    accepted: !!r.accepted
  })) });
});

// POST /api/checkins — create today's checkin (upsert)
router.post('/', authRequired, (req, res) => {
  const { date, moodId, charId, lineEn, lineCn, accepted } = req.body || {};
  if (!date || !moodId || !charId) return res.status(400).json({ error: 'missing_fields' });

  db.prepare(`
    INSERT INTO checkins (user_id, date, mood_id, char_id, line_en, line_cn, accepted)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET
      mood_id = excluded.mood_id,
      char_id = excluded.char_id,
      line_en = excluded.line_en,
      line_cn = excluded.line_cn,
      accepted = COALESCE(excluded.accepted, checkins.accepted)
  `).run(req.user.id, date, moodId, charId, lineEn || null, lineCn || null, accepted ? 1 : 0);

  const row = db.prepare('SELECT * FROM checkins WHERE user_id = ? AND date = ?').get(req.user.id, date);
  res.json({ ok: true, checkin: row });
});

// PUT /api/checkins/:id — mark accepted / reroll
router.put('/:id', authRequired, (req, res) => {
  const row = db.prepare('SELECT * FROM checkins WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'not_found' });

  if (req.body.accepted !== undefined) {
    db.prepare('UPDATE checkins SET accepted = ? WHERE id = ?').run(req.body.accepted ? 1 : 0, row.id);
  }
  if (req.body.lineEn !== undefined) {
    db.prepare('UPDATE checkins SET line_en = ?, line_cn = ? WHERE id = ?')
      .run(req.body.lineEn, req.body.lineCn || null, row.id);
  }

  const updated = db.prepare('SELECT * FROM checkins WHERE id = ?').get(row.id);
  res.json({ ok: true, checkin: updated });
});

// GET /api/checkins/stats — aggregated stats (totalDays, streak, moodsByDay)
router.get('/stats', authRequired, (req, res) => {
  const totalDays = db.prepare(
    'SELECT COUNT(DISTINCT date) AS c FROM checkins WHERE user_id = ?'
  ).get(req.user.id).c;

  // streak: count consecutive days ending at today or yesterday
  const allDates = db.prepare(
    'SELECT DISTINCT date FROM checkins WHERE user_id = ? ORDER BY date DESC'
  ).all(req.user.id).map(r => r.date);

  const streak = calcStreak(allDates);

  const moodsByDay = db.prepare(
    'SELECT date, mood_id, char_id FROM checkins WHERE user_id = ? ORDER BY date DESC LIMIT 14'
  ).all(req.user.id);

  res.json({ totalDays, streak, moodsByDay });
});

function calcStreak(dates) {
  if (!dates.length) return 0;
  const set = new Set(dates);
  const today = new Date();
  const cursor = new Date(today);
  if (!set.has(fmt(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (set.has(fmt(cursor))) { n++; cursor.setDate(cursor.getDate() - 1); }
  return n;
}
function fmt(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

module.exports = router;
