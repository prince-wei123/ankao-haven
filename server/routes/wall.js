const express = require('express');
const db = require('../db');
const { authOptional, authRequired } = require('../middleware/auth');

const router = express.Router();

// GET /api/wall — public
router.get('/', (req, res) => {
  const rows = db.prepare(
    `SELECT wp.id, wp.content, wp.created_at, u.name AS nickname
     FROM wall_posts wp
     LEFT JOIN users u ON wp.user_id = u.id
     ORDER BY wp.created_at DESC LIMIT 50`
  ).all();
  res.json({ posts: rows.map(r => ({
    id: r.id,
    nickname: r.nickname || '匿名研友',
    content: r.content,
    createdAt: r.created_at
  })) });
});

// POST /api/wall — auth optional (anonymous allowed via form field)
router.post('/', authOptional, (req, res) => {
  const { content, nickname } = req.body || {};
  const text = (content || '').trim();
  if (!text || text.length > 500) return res.status(400).json({ error: 'invalid_content' });

  const nick = (nickname || '').trim().slice(0, 12) || (req.user ? (req.user.name || '匿名研友') : '匿名研友');
  const userId = req.user ? req.user.id : null;

  const info = db.prepare(
    'INSERT INTO wall_posts (user_id, nickname, content) VALUES (?, ?, ?)'
  ).run(userId, nick, text);

  // keep only latest 200 posts
  db.prepare(
    'DELETE FROM wall_posts WHERE id NOT IN (SELECT id FROM wall_posts ORDER BY created_at DESC LIMIT 200)'
  ).run();

  res.json({ ok: true, id: info.lastInsertRowid });
});

// DELETE /api/wall/:id — author only
router.delete('/:id', authRequired, (req, res) => {
  const info = db.prepare('DELETE FROM wall_posts WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  res.json({ ok: true, changes: info.changes });
});

module.exports = router;
