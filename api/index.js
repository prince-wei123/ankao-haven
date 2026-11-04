// Vercel serverless 入口。vercel.json 把 /api/* 都重写到这里。
// 注意：这里只导出 app，不能 listen。
module.exports = require('../server/app');
