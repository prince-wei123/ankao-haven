import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS, ACHIEVEMENTS, EXAM_DEFAULT } from '../data/content';
import { useStore } from '../store';

export function Me() {
  const profile = useStore(s => s.profile);
  const stats = useStore(s => s.stats);
  const favs = useStore(s => s.favs);
  const capsules = useStore(s => s.capsules);
  const letters = useStore(s => s.letters);
  const focus = useStore(s => s.focus);
  const tiny = useStore(s => s.tiny);
  const saveProfile = useStore(s => s.saveProfile);
  const toast = useStore(s => s.toast);

  const [name, setName] = useState(profile.name || '');
  const [examDate, setExamDate] = useState(profile.examDate || EXAM_DEFAULT);

  useEffect(() => { setName(profile.name || ''); setExamDate(profile.examDate || EXAM_DEFAULT); }, [profile]);

  return (
    <div className="container-wide pt-8">
      <div className="page-head">
        <div className="text-xs text-accent tracking-[0.18em] uppercase mb-2">ME · 06</div>
        <h1 className="section-title">我的</h1>
      </div>

      {/* 四项指标 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: '累计天数',  val: stats.totalDays || 0,   sub: '天' },
          { label: '连续',      val: stats.streak || 0,     sub: '天' },
          { label: '总专注',    val: focus.total || 0,     sub: '分钟' },
          { label: '金句收藏',  val: favs.length,          sub: '句' }
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5 text-center"
          >
            <div className="font-display text-3xl text-accent">{s.val}</div>
            <div className="text-[10px] text-ink3 tracking-widest uppercase mt-1">{s.label} · {s.sub}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* 金句本 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6 mb-6"
      >
        <h2 className="font-display text-xl mb-4">金句本</h2>
        {favs.length === 0 ? (
          <p className="text-sm text-ink3 py-6 text-center border border-dashed rounded-lg border-paper3">
            还没有收下的句子。在首页或角色页点一下「收进金句本」就好。
          </p>
        ) : (
          <div className="space-y-3">
            {favs.map((f, i) => (
              <div key={f.id || i} className="border-b border-paper3/60 pb-3 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="stamp w-6 h-6 text-[10px]"
                    style={{
                      color: CHARACTERS[f.charId || f.char]?.accent || '#d1738f',
                      borderColor: CHARACTERS[f.charId || f.char]?.accent || '#d1738f'
                    }}
                  >
                    {CHARACTERS[f.charId || f.char]?.stamp || '?'}
                  </div>
                  <span className="text-xs text-ink3">{CHARACTERS[f.charId || f.char]?.name || '—'}</span>
                  {f.createdAt && <span className="text-[10px] text-ink3 ml-auto">{f.createdAt.slice(0, 10)}</span>}
                </div>
                <p className="font-display text-base text-ink leading-relaxed">
                  {typeof f.text === 'string' ? f.text : f.text.en}
                </p>
                {typeof f.text === 'object' && f.text.cn && (
                  <p className="quote-cn">{f.text.cn}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* 成就 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
        className="card p-6 mb-6"
      >
        <h2 className="font-display text-xl mb-4">只奖励，不惩罚</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ACHIEVEMENTS.map((a, i) => {
            const unlocked = a.test({
              checkins: stats.totalDays || 0,
              streak: stats.streak || 0,
              totalMin: focus.total || 0,
              favs: favs.length,
              capsules: capsules.length,
              letters: letters.length,
              tinyDays: (tiny?.items || []).filter(i => i.done && i.text.trim()).length >= 3 ? 1 : 0
            });
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.04 * i }}
                className={`p-3 rounded-lg border text-center transition-all ${
                  unlocked
                    ? 'bg-accent/10 border-accent/40'
                    : 'bg-paper2/40 border-paper3 opacity-60'
                }`}
              >
                <div className={`font-display text-sm ${unlocked ? 'text-accent-dark' : 'text-ink3'}`}>
                  {unlocked ? '★' : '☆'} {a.name}
                </div>
                <div className="text-[10px] text-ink3 mt-1">{a.note}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 设置 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
        className="card p-6"
      >
        <h2 className="font-display text-xl mb-4">设置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-ink3 block mb-1">你的名字（研友圈发帖时显示）</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="可不填" />
          </div>
          <div>
            <label className="text-xs text-ink3 block mb-1">初试日期</label>
            <input className="input" type="date" value={examDate} onChange={e => setExamDate(e.target.value)} />
          </div>
        </div>
        <button
          className="btn-primary btn-sm"
          onClick={() => { saveProfile({ name, examDate }); }}
        >
          保存
        </button>

        <div className="mt-6 pt-4 border-t border-paper3/60">
          <div className="text-xs text-ink3 tracking-widest uppercase mb-3">分享</div>
          <p className="text-xs text-ink2 mb-3">把你的链接发给朋友，她打开就是同一个页面。所有记录（签到、专注、信、胶囊）都存在你这台设备的浏览器里，不会上传，换设备或清缓存需要重新开始。</p>
          <button
            className="btn-ghost btn-sm"
            onClick={() => {
              const u = window.location.origin + window.location.pathname;
              navigator.clipboard?.writeText(u).then(() => toast('链接复制好了。'));
            }}
          >
            复制我的链接
          </button>
        </div>
      </motion.section>
    </div>
  );
}
