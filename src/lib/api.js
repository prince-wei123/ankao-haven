// API client — handles anonymous auth token in localStorage
const TOKEN_KEY = 'ankao_token';
const BASE = import.meta.env.VITE_API_BASE || '';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function request(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await res.json().catch(() => ({ error: 'invalid_json' }));
  if (!res.ok) throw new Error(json.error || `http_${res.status}`);
  return json;
}

// Ensure anonymous user exists (called once on app boot)
export async function ensureAuth() {
  let token = getToken();
  if (token) {
    try {
      await request('GET', '/api/auth/me');
      return token;
    } catch (_) {
      clearToken();
      token = null;
    }
  }
  const { user } = await request('POST', '/api/auth/anonymous');
  setToken(user.token);
  return user.token;
}

export const api = {
  auth: {
    me: () => request('GET', '/api/auth/me'),
    anonymous: () => request('POST', '/api/auth/anonymous')
  },
  checkins: {
    list: (limit = 30) => request('GET', `/api/checkins?limit=${limit}`),
    create: (data) => request('POST', '/api/checkins', data),
    update: (id, data) => request('PUT', `/api/checkins/${id}`, data),
    stats: () => request('GET', '/api/checkins/stats')
  },
  focus: {
    list: (days = 30) => request('GET', `/api/focus?days=${days}`),
    add: (data) => request('POST', '/api/focus', data)
  },
  favs: {
    list: () => request('GET', '/api/favs'),
    add: (data) => request('POST', '/api/favs', data),
    remove: (id) => request('DELETE', `/api/favs/${id}`)
  },
  letters: {
    list: () => request('GET', '/api/letters'),
    create: (data) => request('POST', '/api/letters', data),
    open: (id) => request('POST', `/api/letters/${id}/open`)
  },
  capsules: {
    list: () => request('GET', '/api/capsules'),
    create: (data) => request('POST', '/api/capsules', data),
    open: (id) => request('POST', `/api/capsules/${id}/open`)
  },
  wall: {
    list: () => request('GET', '/api/wall'),
    post: (data) => request('POST', '/api/wall', data)
  },
  settings: {
    get: () => request('GET', '/api/settings'),
    update: (data) => request('PUT', '/api/settings', data)
  },
  tiny: {
    get: (date) => request('GET', `/api/tiny${date ? `?date=${date}` : ''}`),
    update: (data) => request('PUT', '/api/tiny', data)
  },
  health: () => request('GET', '/api/health')
};
