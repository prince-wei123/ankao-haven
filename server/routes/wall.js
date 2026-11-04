const express = require('express');
const { query } = require('../db');
const { authOptional, authRequired } = require('../middleware/auth');
const { ah } = require('../util');

const router = express.Router();

// GET /api/wall — public
router.get('/', ah(async (req, res) => {
  const { rows } = await query(
    `SELECT wp.id, wp.content, wp.created_at, u.name AS nickname
     FROM wall_posts wp
     LEFT JOIN users u ON wp.user_id = u.id
     ORDER BY wp.created_at DESC LIMIT 50`
  );
  res.json({ posts: rows.map(r => ({
    id: r.id,
    nickname: r.nickname || '匿名研友',
    content: r.content,
    createdAt: r.created_at
  })) });
}));

// POST /api/wall — auth optional (anonymous allowed via form field)
router.post('/', authOptional, ah(async (req, res) => {
  const { content, nickname } = req.body || {};
  const text = (content || '').trim();
  if (!text || text.length > 500) return res.status(400).json({ error: 'invalid_content' });

  const nick = (nickname || '').trim().slice(0, 12) || (req.user ? (req.user.name || '匿名研友') : '匿名研友');
  const userId = req.user ? req.user.id : null;

  const { rows } = await query(
    'INSERT INTO wall_posts (user_id, nickname, content) VALUES ($1, $2, $3) RETURNING id',
    [userId, nick, text]
  );

  // keep only latest 200 posts
  await query(
    'DELETE FROM wall_posts WHERE id NOT IN (SELECT id FROM wall_posts ORDER BY created_at DESC LIMIT 200)'
  );

  res.json({ ok: true, id: rows[0].id });
}));

// DELETE /api/wall/:id — author only
router.delete('/:id', authRequired, ah(async (req, res) => {
  const result = await query('DELETE FROM wall_posts WHERE id = $1 AND user_id = $2',
    [parseInt(req.params.id, 10), req.user.id]);
  res.json({ ok: true, changes: result.rowCount });
}));

module.exports = router;
