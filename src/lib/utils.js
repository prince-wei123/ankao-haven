// Date helpers
export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function diffDays(a, b) {
  const ms = 86400000;
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((B - A) / ms);
}
export function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
export function pad(n, w = 2) { return String(n).padStart(w, '0'); }

// English / Chinese line helpers — our data model stores both
export function qMain(q) { return typeof q === 'string' ? q : (q?.en ?? ''); }
export function qSub(q)  { return typeof q === 'string' ? '' : (q?.cn ?? ''); }

// Simple hash (for deterministic picks per day)
export function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
export function pickBy(arr, seed) { return arr[seed % arr.length]; }
export function randomOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function cnWeekday(d) {
  return ['日','一','二','三','四','五','六'][d.getDay()];
}
