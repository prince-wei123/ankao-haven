// 本地开发入口：Express + CORS，前端由 Vite 代理过来（见 vite.config.js）。
// 生产环境不用这个文件 —— Vercel 用 api/index.js。
const cors = require('cors');
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.use(cors());

app.listen(PORT, () => {
  console.log(`[api] ankao-haven backend running on http://localhost:${PORT}`);
});
