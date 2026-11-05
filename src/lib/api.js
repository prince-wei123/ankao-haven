// API 客户端 —— 现在跑在浏览器本地（localStorage），不再请求远程服务器
// 接口的 method / path / 返回结构都沿用原来的 /api 约定，页面代码不用改。
import { localRequest } from './localDb';

const TOKEN_KEY = 'ankao_token';

async function request(method, path, body) {
  return localRequest(method, path, body);
}

// 首次启动时确保本地身份存在（token 只是兼容旧逻辑，实际数据都在 localStorage）
export async function ensureAuth() {
  const { user } = await request('POST', '/api/auth/anonymous');
  localStorage.setItem(TOKEN_KEY, user.token);
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
