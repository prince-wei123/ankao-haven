import { LINES } from '../data/content';

const KEY = 'ankao_line_cursor_v1';

function loadCursor() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; }
}

function saveCursor(c) {
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (_) { /* 忽略写入失败 */ }
}

function shuffled(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 从某个角色在某种情绪下的台词池里取下一句。
 * 规则：一轮之内不重复；一轮走完才重新洗牌，且新的一轮第一句不会和上一句相同。
 * 这样连续点十几次都不会撞同一句，比每次随机抽一句更像“他真在跟你说话”。
 */
export function nextLine(charId, moodId) {
  const pool = LINES[charId]?.[moodId] || [];
  if (!pool.length) return null;

  const cursors = loadCursor();
  const key = `${charId}.${moodId}`;
  let c = cursors[key];

  if (!c || !Array.isArray(c.order) || c.order.length !== pool.length || c.pos >= c.order.length) {
    const order = shuffled(pool.length);
    const prev = c && typeof c.last === 'number' ? c.last : -1;
    if (order.length > 1 && order[0] === prev) {
      [order[0], order[1]] = [order[1], order[0]];
    }
    c = { order, pos: 0, last: prev };
  }

  const idx = c.order[c.pos];
  c.pos += 1;
  c.last = idx;
  cursors[key] = c;
  saveCursor(cursors);
  return pool[idx];
}
