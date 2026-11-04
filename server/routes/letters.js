const express = require('express');
const { query } = require('../db');
const { authRequired } = require('../middleware/auth');
const { ah, todayStr } = require('../util');

const router = express.Router();

// --- Letters ---
router.get('/letters', authRequired, ah(async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM letters WHERE user_id = $1 ORDER BY sealed_at DESC',
    [req.user.id]
  );
  res.json({ letters: rows.map(r => ({
    id: r.id, toWho: r.to_who, content: r.content,
    sealedAt: r.sealed_at, openedAt: r.opened_at
  })) });
}));

router.post('/letters', authRequired, ah(async (req, res) => {
  const { toWho, content } = req.body || {};
  if (!content) return res.status(400).json({ error: 'empty_content' });
  const { rows } = await query(
    'INSERT INTO letters (user_id, to_who, content) VALUES ($1, $2, $3) RETURNING id',
    [req.user.id, toWho || null, content]
  );
  res.json({ ok: true, id: rows[0].id });
}));

router.post('/letters/:id/open', authRequired, ah(async (req, res) => {
  await query(
    `UPDATE letters SET opened_at = to_char(now() AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD HH24:MI:SS')
     WHERE id = $1 AND user_id = $2 AND opened_at IS NULL`,
    [parseInt(req.params.id, 10), req.user.id]
  );
  res.json({ ok: true });
}));

// --- Capsules ---
router.get('/capsules', authRequired, ah(async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM capsules WHERE user_id = $1 ORDER BY sealed_at DESC',
    [req.user.id]
  );
  res.json({ capsules: rows.map(r => ({
    id: r.id, content: r.content, sealDays: r.seal_days,
    sealedAt: r.sealed_at, openAt: r.open_at, opened: !!r.opened
  })) });
}));

router.post('/capsules', authRequired, ah(async (req, res) => {
  const { content, sealDays } = req.body || {};
  if (!content) return res.status(400).json({ error: 'empty_content' });
  const days = Math.max(1, Math.min(parseInt(sealDays) || 30, 365));
  const openStr = todayStr(new Date(Date.now() + days * 86400000));

  const { rows } = await query(
    'INSERT INTO capsules (user_id, content, seal_days, open_at) VALUES ($1, $2, $3, $4) RETURNING id',
    [req.user.id, content, days, openStr]
  );
  res.json({ ok: true, id: rows[0].id, openAt: openStr });
}));

router.post('/capsules/:id/open', authRequired, ah(async (req, res) => {
  const row = (await query('SELECT * FROM capsules WHERE id = $1 AND user_id = $2',
    [parseInt(req.params.id, 10), req.user.id])).rows[0];
  if (!row) return res.status(404).json({ error: 'not_found' });
  if (row.opened) return res.json({ ok: true, already: true });
  // allow open only on or after open_at
  if (todayStr() < row.open_at) return res.status(400).json({ error: 'not_yet', openAt: row.open_at });
  await query('UPDATE capsules SET opened = 1 WHERE id = $1', [row.id]);
  res.json({ ok: true });
}));

module.exports = router;
