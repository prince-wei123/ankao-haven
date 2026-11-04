// 共享的 Express app：本地开发（server/index.js）和 Vercel 函数（api/index.js）都用这一个。
// 不 listen、不管静态文件 —— 静态文件由 Vite / Vercel 处理。
const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// 健康检查：同时验证数据库是否连通（冷启动时会顺手建表）
app.get('/api/health', async (req, res) => {
  if (!db.isConfigured()) {
    return res.status(503).json({ ok: false, error: 'DATABASE_URL 未配置', storage: 'none' });
  }
  try {
    await db.query('SELECT 1');
    res.json({
      ok: true,
      ts: Date.now(),
      storage: 'postgres',
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7)
    });
  } catch (err) {
    console.error('[api] health db error:', err.message);
    res.status(503).json({ ok: false, error: 'db_unavailable', detail: String(err.message || err).slice(0, 160) });
  }
});

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/focus',    require('./routes/focus'));
app.use('/api/favs',     require('./routes/favs'));
app.use('/api',          require('./routes/letters'));   // letters + capsules
app.use('/api/wall',     require('./routes/wall'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/tiny',     require('./routes/tiny'));

// 未匹配的 API 路径统一返回 JSON 404，避免被 SPA fallback 吞掉
app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }));

// 错误兜底
app.use((err, req, res, _next) => {
  console.error('[api]', err);
  if (err && err.code === 'NO_DATABASE_URL') {
    return res.status(503).json({ error: 'db_not_configured' });
  }
  res.status(500).json({ error: 'internal' });
});

module.exports = app;
