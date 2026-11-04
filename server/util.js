// 通用小工具：async 路由包装 + 上海时区日期
// 服务器（Vercel）跑在 UTC，直接用 new Date() 取「今天」会在 0:00–8:00 之间差一天，
// 所以统一用 Asia/Shanghai 格式化。

function ah(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

const DATE_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

// YYYY-MM-DD
function todayStr(d = new Date()) {
  return DATE_FMT.format(d);
}

module.exports = { ah, todayStr };
