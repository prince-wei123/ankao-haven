const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// GET /api/favs
router.get('/', authRequired, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM favs WHERE user_id = ? ORDER BY created_at DESC LIMIT 200'
  ).all(req.user.id);
  res.json({ favs: rows.map(r => ({
    id: r.id,
    charId: r.char_id,
    text: { en: r.text_en, cn: r.text_cn },
    createdAt: r.created_at
  })) });
});

// POST /api/favs
router.post('/', authRequired, (req, res) => {
  const { charId, textEn, textCn } = req.body || {};
  if (!textEn) return res.status(400).json({ error: 'empty_text' });

  // dedupe per user
  const existing = db.prepare(
    'SELECT id FROM favs WHERE user_id = ? AND text_en = ?'
  ).get(req.user.id, textEn);
  if (existing) return res.json({ ok: true, id: existing.id, already: true });

  const info = db.prepare(
    'INSERT INTO favs (user_id, char_id, text_en, text_cn) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, charId || null, textEn, textCn || null);
  res.json({ ok: true, id: info.lastInsertRowid });
});

// DELETE /api/favs/:id
router.delete('/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM favs WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  res.json({ ok: true });
});

module.exports = router;
