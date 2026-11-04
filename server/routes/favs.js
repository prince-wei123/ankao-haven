const express = require('express');
const { query } = require('../db');
const { authRequired } = require('../middleware/auth');
const { ah } = require('../util');

const router = express.Router();

// GET /api/favs
router.get('/', authRequired, ah(async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM favs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200',
    [req.user.id]
  );
  res.json({ favs: rows.map(r => ({
    id: r.id,
    charId: r.char_id,
    text: { en: r.text_en, cn: r.text_cn },
    createdAt: r.created_at
  })) });
}));

// POST /api/favs
router.post('/', authRequired, ah(async (req, res) => {
  const { charId, textEn, textCn } = req.body || {};
  if (!textEn) return res.status(400).json({ error: 'empty_text' });

  // dedupe per user
  const existing = (await query(
    'SELECT id FROM favs WHERE user_id = $1 AND text_en = $2',
    [req.user.id, textEn]
  )).rows[0];
  if (existing) return res.json({ ok: true, id: existing.id, already: true });

  const { rows } = await query(
    'INSERT INTO favs (user_id, char_id, text_en, text_cn) VALUES ($1, $2, $3, $4) RETURNING id',
    [req.user.id, charId || null, textEn, textCn || null]
  );
  res.json({ ok: true, id: rows[0].id });
}));

// DELETE /api/favs/:id
router.delete('/:id', authRequired, ah(async (req, res) => {
  await query('DELETE FROM favs WHERE id = $1 AND user_id = $2',
    [parseInt(req.params.id, 10), req.user.id]);
  res.json({ ok: true });
}));

module.exports = router;
