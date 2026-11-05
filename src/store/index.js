import { create } from 'zustand';
import { api, ensureAuth } from '../lib/api';
import { todayKey } from '../lib/utils';

// Central app store — Zustand
export const useStore = create((set, get) => ({
  // Auth
  token: null,
  user: null,

  // Current daily state
  todayCheckin: null,    // { moodId, charId, line: {en,cn}, accepted, date }
  stats: { totalDays: 0, streak: 0, moodsByDay: [] },
  favs: [],
  focus: { rows: [], total: 0, today: 0 },
  letters: [],
  capsules: [],
  wall: [],
  tiny: null,
  profile: { name: null, examDate: null },

  // UI
  loading: true,
  toast: null,

  async boot() {
    try {
      const token = await ensureAuth();
      set({ token });

      // Parallel initial fetches
      await Promise.allSettled([
        get().refreshProfile(),
        get().refreshStats(),
        get().refreshFavs(),
        get().refreshFocus(),
        get().refreshLetters(),
        get().refreshCapsules(),
        get().refreshTiny()
      ]);

      // Try to load today's checkin — will be null if none yet
      await get().refreshToday();
    } catch (e) {
      console.error('[boot]', e);
    } finally {
      set({ loading: false });
    }
  },

  toast(msg) {
    set({ toast: msg });
    clearTimeout(get()._toastTimer);
    get()._toastTimer = setTimeout(() => set({ toast: null }), 2800);
  },

  async refreshProfile() {
    const r = await api.settings.get();
    set({ profile: r.profile });
  },

  async refreshStats() {
    const r = await api.checkins.stats();
    set({ stats: r });
  },

  async refreshToday() {
    const r = await api.checkins.list(1);
    const today = todayKey();
    const t = (r.checkins || []).find(c => c.date === today);
    set({ todayCheckin: t || null });
  },

  async refreshFavs() {
    const r = await api.favs.list();
    set({ favs: r.favs });
  },

  async refreshFocus() {
    const r = await api.focus.list(30);
    set({ focus: r });
  },

  async refreshLetters() {
    const r = await api.letters.list();
    set({ letters: r.letters });
  },

  async refreshCapsules() {
    const r = await api.capsules.list();
    set({ capsules: r.capsules });
  },

  async refreshTiny() {
    const r = await api.tiny.get();
    set({ tiny: r });
  },

  async postCheckin(moodId, charId, line, accepted = false) {
    const today = todayKey();
    await api.checkins.create({
      date: today, moodId, charId,
      lineEn: line?.en || '', lineCn: line?.cn || '',
      accepted: accepted ? 1 : 0
    });
    await get().refreshToday();
    await get().refreshStats();
  },

  async acceptToday() {
    const t = get().todayCheckin;
    if (!t) return;
    await api.checkins.update(t.id, { accepted: true });
    await get().refreshToday();
    await get().refreshStats();
    get().toast('收下了。今天记下一笔，不算任务，只算你还在。');
  },

  async addFav(charId, text) {
    const isObj = typeof text === 'object' && text !== null;
    await api.favs.add({
      charId,
      textEn: isObj ? (text.en || '') : text,
      textCn: isObj ? (text.cn || '') : ''
    });
    await get().refreshFavs();
    get().toast('收进金句本了。');
  },

  async postFocus(minutes, subject) {
    await api.focus.add({ date: todayKey(), minutes, subject });
    await get().refreshFocus();
    await get().refreshStats();
    get().toast(`+${minutes} 分钟，记下了。`);
  },

  async saveTiny(items) {
    await api.tiny.update({ date: todayKey(), items });
    await get().refreshTiny();
  },

  async saveProfile(data) {
    await api.settings.update(data);
    await get().refreshProfile();
    get().toast('保存好了。');
  }
}));
