const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// GET /api/tiny?date=YYYY-MM-DD
router.get('/', authRequired, (req, res) => {
  const date = req.query.date || fmt(new Date());
  const row = db.prepare('SELECT * FROM tiny WHERE user_id = ? AND date = ?').get(req.user.id, date);
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
});

// PUT /api/tiny
router.put('/', authRequired, (req, res) => {
  const date = req.body.date || fmt(new Date());
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const item0 = (items[0]?.text || '').slice(0, 60) || '';
  const item1 = (items[1]?.text || '').slice(0, 60) || '';
  const item2 = (items[2]?.text || '').slice(0, 60) || '';
  const done0 = items[0]?.done ? 1 : 0;
  const done1 = items[1]?.done ? 1 : 0;
  const done2 = items[2]?.done ? 1 : 0;
  const cheered = done0 && done1 && done2 ? 1 : 0;

  db.prepare(`
    INSERT INTO tiny (user_id, date, item0, done0, item1, done1, item2, done2, cheered)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET
      item0 = excluded.item0, done0 = excluded.done0,
      item1 = excluded.item1, done1 = excluded.done1,
      item2 = excluded.item2, done2 = excluded.done2,
      cheered = excluded.cheered
  `).run(req.user.id, date, item0, done0, item1, done1, item2, done2, cheered);

  res.json({ ok: true, date, cheered });
});

function fmt(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

module.exports = router;
