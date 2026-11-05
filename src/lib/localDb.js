// 本地数据层 —— 用浏览器 localStorage 顶替原来的 Postgres 后端
// 单机单人使用：签到、专注、收藏、信件、胶囊、小事都存在本机浏览器里，
// 不需要服务器、不需要联网。代价是换设备或清空缓存数据会丢。

const KEY = 'ankao_local_db_v1';

const DATE_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
});

const TIME_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
});

function todayStr(d = new Date()) { return DATE_FMT.format(d); }

function stamp(d = new Date()) {
  const parts = Object.fromEntries(TIME_FMT.formatToParts(d).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function emptyDb() {
  return {
    seq: 0, user: null,
    checkins: [], focus: [], favs: [], letters: [], capsules: [], wall: [], tiny: {}
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDb();
    return { ...emptyDb(), ...JSON.parse(raw) };
  } catch (_) {
    return emptyDb();
  }
}

function save(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (_) { /* 配额满了就静默失败 */ }
}

function nextId(db) { db.seq += 1; return db.seq; }

function rand(n) { return Math.random().toString(36).slice(2).padEnd(n, '0').slice(0, n); }

function mapCheckin(c) {
  return {
    id: c.id, date: c.date, moodId: c.mood_id, charId: c.char_id,
    line: { en: c.line_en, cn: c.line_cn }, accepted: !!c.accepted
  };
}

function calcStreak(dates) {
  if (!dates.length) return 0;
  const set = new Set(dates);
  const cursor = new Date();
  if (!set.has(todayStr(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (set.has(todayStr(cursor))) { n++; cursor.setDate(cursor.getDate() - 1); }
  return n;
}

// 与原来 Express 接口一一对应：同样的 method / path / 返回结构
export async function localRequest(method, path, body = {}) {
  const db = load();
  const [pathname, qs] = path.split('?');
  const q = Object.fromEntries(new URLSearchParams(qs || '').entries());
  const m = method.toUpperCase();
  const seg = pathname.split('/').filter(Boolean);
  const lastNum = Number(seg[seg.length - 1]);

  // --- 健康检查 ---
  if (pathname === '/api/health') {
    return { ok: true, storage: 'local', ts: Date.now() };
  }

  // --- 身份（本地单用户，token 只是给前端沿用原来的逻辑）---
  if (pathname === '/api/auth/anonymous' && m === 'POST') {
    if (!db.user) {
      db.user = {
        id: rand(10), token: rand(24), name: null, exam_date: null,
        first_visit: todayStr(), last_visit: todayStr()
      };
    } else {
      db.user.last_visit = todayStr();
    }
    save(db);
    const u = db.user;
    return { user: { id: u.id, token: u.token, name: u.name, exam_date: u.exam_date }, firstVisit: u.first_visit };
  }

  if (pathname === '/api/auth/me' && m === 'GET') {
    if (!db.user) return { user: null };
    const u = db.user;
    return {
      user: {
        id: u.id, token: u.token, name: u.name, exam_date: u.exam_date,
        firstVisit: u.first_visit, lastVisit: u.last_visit
      }
    };
  }

  // --- 签到 ---
  if (pathname === '/api/checkins' && m === 'GET') {
    const limit = Math.min(parseInt(q.limit, 10) || 30, 365);
    const rows = [...db.checkins].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
    return { checkins: rows.map(mapCheckin) };
  }

  if (pathname === '/api/checkins' && m === 'POST') {
    const { date, moodId, charId, lineEn, lineCn, accepted } = body;
    if (!date || !moodId || !charId) throw new Error('missing_fields');
    let row = db.checkins.find(c => c.date === date);
    const patch = {
      mood_id: moodId, char_id: charId,
      line_en: lineEn || null, line_cn: lineCn || null, accepted: accepted ? 1 : 0
    };
    if (row) Object.assign(row, patch);
    else {
      row = { id: nextId(db), date, ...patch };
      db.checkins.push(row);
    }
    save(db);
    return { ok: true, checkin: mapCheckin(row) };
  }

  if (pathname === '/api/checkins/stats' && m === 'GET') {
    const dates = [...new Set(db.checkins.map(c => c.date))].sort().reverse();
    const moodsByDay = [...db.checkins]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14)
      .map(c => ({ date: c.date, mood_id: c.mood_id, char_id: c.char_id }));
    return { totalDays: dates.length, streak: calcStreak(dates), moodsByDay };
  }

  if (pathname.startsWith('/api/checkins/') && m === 'PUT') {
    const row = db.checkins.find(c => c.id === lastNum);
    if (!row) throw new Error('not_found');
    if (body.accepted !== undefined) row.accepted = body.accepted ? 1 : 0;
    if (body.lineEn !== undefined) {
      row.line_en = body.lineEn;
      row.line_cn = body.lineCn || null;
    }
    save(db);
    return { ok: true, checkin: mapCheckin(row) };
  }

  // --- 专注时长 ---
  if (pathname === '/api/focus' && m === 'GET') {
    const days = Math.min(parseInt(q.days, 10) || 30, 365);
    const since = todayStr(new Date(Date.now() - days * 86400000));
    const byDate = {};
    db.focus.filter(f => f.date >= since).forEach(f => {
      byDate[f.date] = (byDate[f.date] || 0) + f.minutes;
    });
    const rows = Object.keys(byDate).sort().reverse().map(d => ({ date: d, minutes: byDate[d] }));
    return {
      rows,
      total: db.focus.reduce((s, f) => s + f.minutes, 0),
      today: byDate[todayStr()] || 0
    };
  }

  if (pathname === '/api/focus' && m === 'POST') {
    const minutes = parseInt(body.minutes, 10) || 0;
    if (minutes <= 0) throw new Error('invalid_minutes');
    const row = {
      id: nextId(db), date: body.date || todayStr(),
      minutes, subject: body.subject || null
    };
    db.focus.push(row);
    save(db);
    return { ok: true, id: row.id };
  }

  if (pathname.startsWith('/api/focus/') && m === 'DELETE') {
    const before = db.focus.length;
    db.focus = db.focus.filter(f => f.id !== lastNum);
    save(db);
    return { ok: true, changes: before - db.focus.length };
  }

  // --- 收藏 ---
  if (pathname === '/api/favs' && m === 'GET') {
    const rows = [...db.favs]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 200);
    return {
      favs: rows.map(f => ({
        id: f.id, charId: f.char_id,
        text: { en: f.text_en, cn: f.text_cn }, createdAt: f.created_at
      }))
    };
  }

  if (pathname === '/api/favs' && m === 'POST') {
    const { charId, textEn, textCn } = body;
    if (!textEn) throw new Error('empty_text');
    const existing = db.favs.find(f => f.text_en === textEn);
    if (existing) return { ok: true, id: existing.id, already: true };
    const row = {
      id: nextId(db), char_id: charId || null,
      text_en: textEn, text_cn: textCn || null, created_at: stamp()
    };
    db.favs.push(row);
    save(db);
    return { ok: true, id: row.id };
  }

  if (pathname.startsWith('/api/favs/') && m === 'DELETE') {
    db.favs = db.favs.filter(f => f.id !== lastNum);
    save(db);
    return { ok: true };
  }

  // --- 信 ---
  if (pathname === '/api/letters' && m === 'GET') {
    const rows = [...db.letters].sort((a, b) => b.sealed_at.localeCompare(a.sealed_at));
    return {
      letters: rows.map(l => ({
        id: l.id, toWho: l.to_who, content: l.content,
        sealedAt: l.sealed_at, openedAt: l.opened_at
      }))
    };
  }

  if (pathname === '/api/letters' && m === 'POST') {
    if (!body.content) throw new Error('empty_content');
    const row = {
      id: nextId(db), to_who: body.toWho || null,
      content: body.content, sealed_at: stamp(), opened_at: null
    };
    db.letters.push(row);
    save(db);
    return { ok: true, id: row.id };
  }

  if (pathname.startsWith('/api/letters/') && pathname.endsWith('/open') && m === 'POST') {
    const row = db.letters.find(l => l.id === Number(seg[seg.length - 2]));
    if (row && !row.opened_at) { row.opened_at = stamp(); save(db); }
    return { ok: true };
  }

  // --- 时间胶囊 ---
  if (pathname === '/api/capsules' && m === 'GET') {
    const rows = [...db.capsules].sort((a, b) => b.sealed_at.localeCompare(a.sealed_at));
    return {
      capsules: rows.map(c => ({
        id: c.id, content: c.content, sealDays: c.seal_days,
        sealedAt: c.sealed_at, openAt: c.open_at, opened: !!c.opened
      }))
    };
  }

  if (pathname === '/api/capsules' && m === 'POST') {
    if (!body.content) throw new Error('empty_content');
    const days = Math.max(1, Math.min(parseInt(body.sealDays, 10) || 30, 365));
    const openAt = todayStr(new Date(Date.now() + days * 86400000));
    const row = {
      id: nextId(db), content: body.content, seal_days: days,
      sealed_at: stamp(), open_at: openAt, opened: 0
    };
    db.capsules.push(row);
    save(db);
    return { ok: true, id: row.id, openAt };
  }

  if (pathname.startsWith('/api/capsules/') && pathname.endsWith('/open') && m === 'POST') {
    const row = db.capsules.find(c => c.id === Number(seg[seg.length - 2]));
    if (!row) throw new Error('not_found');
    if (row.opened) return { ok: true, already: true };
    if (todayStr() < row.open_at) throw new Error('not_yet');
    row.opened = 1;
    save(db);
    return { ok: true };
  }

  // --- 研友墙（本地版：只有自己写的帖子，留个入口不删）---
  if (pathname === '/api/wall' && m === 'GET') {
    const rows = [...db.wall].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50);
    return {
      posts: rows.map(p => ({
        id: p.id, nickname: p.nickname || '匿名研友',
        content: p.content, createdAt: p.created_at
      }))
    };
  }

  if (pathname === '/api/wall' && m === 'POST') {
    const text = (body.content || '').trim();
    if (!text || text.length > 500) throw new Error('invalid_content');
    const nick = (body.nickname || '').trim().slice(0, 12)
      || (db.user && db.user.name) || '匿名研友';
    const row = { id: nextId(db), nickname: nick, content: text, created_at: stamp() };
    db.wall.push(row);
    db.wall = db.wall.slice(-200);
    save(db);
    return { ok: true, id: row.id };
  }

  if (pathname.startsWith('/api/wall/') && m === 'DELETE') {
    const before = db.wall.length;
    db.wall = db.wall.filter(p => p.id !== lastNum);
    save(db);
    return { ok: true, changes: before - db.wall.length };
  }

  // --- 个人设置 ---
  if (pathname === '/api/settings' && m === 'GET') {
    const u = db.user || {};
    return {
      profile: {
        id: u.id, name: u.name || null, examDate: u.exam_date || null,
        firstVisit: u.first_visit, lastVisit: u.last_visit
      }
    };
  }

  if (pathname === '/api/settings' && m === 'PUT') {
    if (!db.user) throw new Error('no_token');
    const name = (body.name || '').trim().slice(0, 12) || null;
    let d = body.examDate || null;
    if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) d = null;
    if (name) db.user.name = name;
    if (d) db.user.exam_date = d;
    save(db);
    const u = db.user;
    return {
      ok: true,
      profile: {
        id: u.id, name: u.name, examDate: u.exam_date,
        firstVisit: u.first_visit, lastVisit: u.last_visit
      }
    };
  }

  // --- 每日三件小事 ---
  if (pathname === '/api/tiny' && m === 'GET') {
    const date = q.date || todayStr();
    const row = db.tiny[date];
    if (!row) {
      return {
        date,
        items: [{ text: '', done: false }, { text: '', done: false }, { text: '', done: false }],
        cheered: false
      };
    }
    return {
      date,
      items: [
        { text: row.item0 || '', done: !!row.done0 },
        { text: row.item1 || '', done: !!row.done1 },
        { text: row.item2 || '', done: !!row.done2 }
      ],
      cheered: !!row.cheered
    };
  }

  if (pathname === '/api/tiny' && m === 'PUT') {
    const date = body.date || todayStr();
    const items = Array.isArray(body.items) ? body.items : [];
    const text = i => (items[i]?.text || '').slice(0, 60) || '';
    const done = i => (items[i]?.done ? 1 : 0);
    const cheered = done(0) && done(1) && done(2) ? 1 : 0;
    db.tiny[date] = {
      item0: text(0), done0: done(0),
      item1: text(1), done1: done(1),
      item2: text(2), done2: done(2),
      cheered
    };
    save(db);
    return { ok: true, date, cheered };
  }

  throw new Error('not_found');
}
