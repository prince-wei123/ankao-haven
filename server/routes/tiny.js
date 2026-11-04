const express = require('express');
const { query } = require('../db');
const { authRequired } = require('../middleware/auth');
const { ah, todayStr } = require('../util');

const router = express.Router();

// GET /api/tiny?date=YYYY-MM-DD
router.get('/', authRequired, ah(async (req, res) => {
  const date = req.query.date || todayStr();
  const row = (await query('SELECT * FROM tiny WHERE user_id = $1 AND date = $2', [req.user.id, date])).rows[0];
  if (!row) {
    return res.json({ date, items: [{ text: '', done: false }, { text: '', done: false }, { text: '', done: false }], cheered: false });
  }
  res.json({
    date,
    items: [
      { text: row.item0 || '', done: !!row.done0 },
      { text: row.item1 || '', done: !!row.done1 },
      { text: row.item2 || '', done: !!row.done2 }
    ],
    cheered: !!row.cheered
  });
}));

// PUT /api/tiny
router.put('/', authRequired, ah(async (req, res) => {
  const date = req.body.date || todayStr();
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const item0 = (items[0]?.text || '').slice(0, 60) || '';
  const item1 = (items[1]?.text || '').slice(0, 60) || '';
  const item2 = (items[2]?.text || '').slice(0, 60) || '';
  const done0 = items[0]?.done ? 1 : 0;
  const done1 = items[1]?.done ? 1 : 0;
  const done2 = items[2]?.done ? 1 : 0;
  const cheered = done0 && done1 && done2 ? 1 : 0;

  await query(`
    INSERT INTO tiny (user_id, date, item0, done0, item1, done1, item2, done2, cheered)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (user_id, date) DO UPDATE SET
      item0 = excluded.item0, done0 = excluded.done0,
      item1 = excluded.item1, done1 = excluded.done1,
      item2 = excluded.item2, done2 = excluded.done2,
      cheered = excluded.cheered
  `, [req.user.id, date, item0, done0, item1, done1, item2, done2, cheered]);

  res.json({ ok: true, date, cheered });
}));

module.exports = router;
