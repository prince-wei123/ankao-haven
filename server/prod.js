// 生产入口：Express 同时托管 Vite 构建产物（dist）和 API，同源，无跨域问题。
// 启动：node prod.js   （Railway 通过 railway.json 的 startCommand 调用）
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// --- API ---
const db = require('./db');

app.get('/api/health', (req, res) =>
  res.json({ ok: true, ts: Date.now(), storage: db.dbPath.startsWith('/data') ? 'volume' : 'local' })
);
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

// --- 静态文件 ---
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.error('[ankao-haven] 找不到 dist/，请先在项目根目录执行 npm run build');
  process.exit(1);
}

app.use(express.static(distDir, { maxAge: '7d', index: false }));

// SPA fallback：所有非 API 路径都交给 index.html，前端路由自己处理
app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')));

// 错误兜底
app.use((err, req, res, _next) => {
  console.error('[api]', err);
  res.status(500).json({ error: 'internal' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ankao-haven] listening on http://0.0.0.0:${PORT}`);
});
