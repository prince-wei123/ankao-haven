const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// --- Letters ---
router.get('/letters', authRequired, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM letters WHERE user_id = ? ORDER BY sealed_at DESC'
  ).all(req.user.id);
  res.json({ letters: rows.map(r => ({
    id: r.id, toWho: r.to_who, content: r.content,
    sealedAt: r.sealed_at, openedAt: r.opened_at
  })) });
});

router.post('/letters', authRequired, (req, res) => {
  const { toWho, content } = req.body || {};
  if (!content) return res.status(400).json({ error: 'empty_content' });
  const info = db.prepare(
    'INSERT INTO letters (user_id, to_who, content) VALUES (?, ?, ?)'
  ).run(req.user.id, toWho || null, content);
  res.json({ ok: true, id: info.lastInsertRowid });
});

router.post('/letters/:id/open', authRequired, (req, res) => {
  db.prepare('UPDATE letters SET opened_at = datetime(\'now\',\'localtime\') WHERE id = ? AND user_id = ? AND opened_at IS NULL')
    .run(req.params.id, req.user.id);
  res.json({ ok: true });
});

// --- Capsules ---
router.get('/capsules', authRequired, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM capsules WHERE user_id = ? ORDER BY sealed_at DESC'
  ).all(req.user.id);
  res.json({ capsules: rows.map(r => ({
    id: r.id, content: r.content, sealDays: r.seal_days,
    sealedAt: r.sealed_at, openAt: r.open_at, opened: !!r.opened
  })) });
});

router.post('/capsules', authRequired, (req, res) => {
  const { content, sealDays } = req.body || {};
  if (!content) return res.status(400).json({ error: 'empty_content' });
  const days = Math.max(1, Math.min(parseInt(sealDays) || 30, 365));
  const openAt = new Date(Date.now() + days * 86400000);
  const openStr = `${openAt.getFullYear()}-${String(openAt.getMonth()+1).padStart(2,'0')}-${String(openAt.getDate()).padStart(2,'0')}`;

  const info = db.prepare(
    'INSERT INTO capsules (user_id, content, seal_days, open_at) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, content, days, openStr);
  res.json({ ok: true, id: info.lastInsertRowid, openAt: openStr });
});

router.post('/capsules/:id/open', authRequired, (req, res) => {
  const row = db.prepare('SELECT * FROM capsules WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'not_found' });
  if (row.opened) return res.json({ ok: true, already: true });
  // allow open only on or after open_at
  const today = fmt(new Date());
  if (today < row.open_at) return res.status(400).json({ error: 'not_yet', openAt: row.open_at });
  db.prepare('UPDATE capsules SET opened = 1 WHERE id = ?').run(row.id);
  res.json({ ok: true });
});

function fmt(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

module.exports = router;
