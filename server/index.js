// Express app entrypoint — dev mode only.
// For Vercel deployment, see /api/*.js serverless wrappers.
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ ok: true, ts: Date.now(), storage: process.env.DB_PATH ? 'volume' : 'local' })
);

// Mount routers
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/focus',    require('./routes/focus'));
app.use('/api/favs',     require('./routes/favs'));
app.use('/api',          require('./routes/letters'));   // letters + capsules
app.use('/api/wall',     require('./routes/wall'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/tiny',     require('./routes/tiny'));

// Serve Vite-built static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Error handler
app.use((err, req, res, _next) => {
  console.error('[api]', err);
  res.status(500).json({ error: 'internal' });
});

app.listen(PORT, () => {
  console.log(`[api] ankao-haven backend running on http://localhost:${PORT}`);
});

module.exports = app;
