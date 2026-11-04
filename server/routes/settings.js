const express = require('express');
const { query } = require('../db');
const { authRequired } = require('../middleware/auth');
const { ah } = require('../util');

const router = express.Router();

// GET /api/settings — fetch user profile
router.get('/', authRequired, (req, res) => {
  res.json({
    profile: {
      id: req.user.id,
      name: req.user.name,
      examDate: req.user.exam_date,
      firstVisit: req.user.first_visit,
      lastVisit: req.user.last_visit
    }
  });
});

// PUT /api/settings — update
router.put('/', authRequired, ah(async (req, res) => {
  const { name, examDate } = req.body || {};
  const n = (name || '').trim().slice(0, 12) || null;
  let d = examDate || null;
  if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) d = null;

  await query('UPDATE users SET name = COALESCE($1, name), exam_date = COALESCE($2, exam_date) WHERE id = $3',
    [n, d, req.user.id]);

  const row = (await query('SELECT * FROM users WHERE id = $1', [req.user.id])).rows[0];
  res.json({ ok: true, profile: {
    id: row.id, name: row.name, examDate: row.exam_date,
    firstVisit: row.first_visit, lastVisit: row.last_visit
  }});
}));

module.exports = router;
