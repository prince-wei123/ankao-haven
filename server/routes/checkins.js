const express = require('express');
const { query } = require('../db');
const { authRequired } = require('../middleware/auth');
const { ah, todayStr } = require('../util');

const router = express.Router();

// GET /api/checkins?limit=30
router.get('/', authRequired, ah(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 30, 365);
  const { rows } = await query(
    'SELECT * FROM checkins WHERE user_id = $1 ORDER BY date DESC LIMIT $2',
    [req.user.id, limit]
  );
  res.json({ checkins: rows.map(r => ({
    id: r.id,
    date: r.date,
    moodId: r.mood_id,
    charId: r.char_id,
    line: { en: r.line_en, cn: r.line_cn },
    accepted: !!r.accepted
  })) });
}));

// POST /api/checkins — create today's checkin (upsert)
router.post('/', authRequired, ah(async (req, res) => {
  const { date, moodId, charId, lineEn, lineCn, accepted } = req.body || {};
  if (!date || !moodId || !charId) return res.status(400).json({ error: 'missing_fields' });

  await query(`
    INSERT INTO checkins (user_id, date, mood_id, char_id, line_en, line_cn, accepted)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (user_id, date) DO UPDATE SET
      mood_id = excluded.mood_id,
      char_id = excluded.char_id,
      line_en = excluded.line_en,
      line_cn = excluded.line_cn,
      accepted = COALESCE(excluded.accepted, checkins.accepted)
  `, [req.user.id, date, moodId, charId, lineEn || null, lineCn || null, accepted ? 1 : 0]);

  const { rows } = await query('SELECT * FROM checkins WHERE user_id = $1 AND date = $2', [req.user.id, date]);
  res.json({ ok: true, checkin: rows[0] });
}));

// PUT /api/checkins/:id — mark accepted / reroll
router.put('/:id', authRequired, ah(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { rows } = await query('SELECT * FROM checkins WHERE id = $1 AND user_id = $2', [id, req.user.id]);
  const row = rows[0];
  if (!row) return res.status(404).json({ error: 'not_found' });

  if (req.body.accepted !== undefined) {
    await query('UPDATE checkins SET accepted = $1 WHERE id = $2', [req.body.accepted ? 1 : 0, row.id]);
  }
  if (req.body.lineEn !== undefined) {
    await query('UPDATE checkins SET line_en = $1, line_cn = $2 WHERE id = $3',
      [req.body.lineEn, req.body.lineCn || null, row.id]);
  }

  const updated = (await query('SELECT * FROM checkins WHERE id = $1', [row.id])).rows[0];
  res.json({ ok: true, checkin: updated });
}));

// GET /api/checkins/stats — aggregated stats (totalDays, streak, moodsByDay)
router.get('/stats', authRequired, ah(async (req, res) => {
  const totalDays = (await query(
    'SELECT COUNT(DISTINCT date)::int AS c FROM checkins WHERE user_id = $1',
    [req.user.id]
  )).rows[0].c;

  // streak: count consecutive days ending at today or yesterday
  const allDates = (await query(
    'SELECT DISTINCT date FROM checkins WHERE user_id = $1 ORDER BY date DESC',
    [req.user.id]
  )).rows.map(r => r.date);

  const streak = calcStreak(allDates);

  const moodsByDay = (await query(
    'SELECT date, mood_id, char_id FROM checkins WHERE user_id = $1 ORDER BY date DESC LIMIT 14',
    [req.user.id]
  )).rows;

  res.json({ totalDays, streak, moodsByDay });
}));

function calcStreak(dates) {
  if (!dates.length) return 0;
  const set = new Set(dates);
  const cursor = new Date();
  if (!set.has(todayStr(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (set.has(todayStr(cursor))) { n++; cursor.setDate(cursor.getDate() - 1); }
  return n;
}

module.exports = router;
