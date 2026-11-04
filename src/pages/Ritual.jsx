import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS, EXPEDITION } from '../data/content';
import { useStore } from '../store';
import { api } from '../lib/api';
import { qMain, qSub } from '../lib/utils';

export function Ritual() {
  return (
    <div className="container-wide pt-8">
      <div className="page-head">
        <div className="text-xs text-accent tracking-[0.18em] uppercase mb-2">RITUAL · 04</div>
        <h1 className="section-title">仪式</h1>
        <p className="section-sub">写信、封存胶囊、出征令、毕业预演。这些不是游戏，是你为自己留的凭证。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LetterBox />
        <CapsuleBox />
        <ExpeditionCard />
        <GraduationCard />
      </div>
    </div>
  );
}

function LetterBox() {
  const [toWho, setToWho] = useState('未来的自己');
  const [content, setContent] = useState('');
  const letters = useStore(s => s.letters);
  const refreshLetters = useStore(s => s.refreshLetters);
  const toast = useStore(s => s.toast);

  const write = async () => {
    if (!content.trim()) return toast('写点什么吧。');
    await api.letters.create({ toWho, content });
    setContent('');
    await refreshLetters();
    toast('信寄出去了。它还在路上，你不会收到回执。');
  };

  const openLetter = async (id) => {
    await api.letters.open(id);
    await refreshLetters();
    toast('拆开了。');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <h2 className="font-display text-xl mb-1">给未来的自己</h2>
      <p className="text-xs text-ink3 mb-4">一封无法立刻拆开的信。</p>

      <input
        className="input mb-3"
        value={toWho} onChange={e => setToWho(e.target.value)}
        placeholder="写给谁？（未来的自己 / 某个朋友）"
      />
      <textarea
        rows={4}
        className="textarea mb-3"
        value={content} onChange={e => setContent(e.target.value)}
        placeholder="你好，我是 X 年的你……"
      />
      <button onClick={write} className="btn-primary btn-sm">寄出去</button>

      {letters.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="text-[10px] text-ink3 tracking-widest uppercase">已寄出</div>
          {letters.map(l => (
            <div key={l.id} className="border-t border-paper3/60 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink2">→ {l.toWho}</span>
                <span className="text-[10px] text-ink3">{l.sealedAt}</span>
              </div>
              {l.openedAt ? (
                <div className="mt-1 text-xs text-ink2 p-2 bg-paper2/60 rounded">
                  <div className="text-[10px] text-accent mb-1">已拆开 · {l.openedAt}</div>
                  {l.content}
                </div>
              ) : (
                <button
                  onClick={() => openLetter(l.id)}
                  className="btn-text btn-sm text-xs mt-1"
                >
                  拆开 →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function CapsuleBox() {
  const [content, setContent] = useState('');
  const [days, setDays] = useState(30);
  const capsules = useStore(s => s.capsules);
  const refreshCapsules = useStore(s => s.refreshCapsules);
  const toast = useStore(s => s.toast);

  const seal = async () => {
    if (!content.trim()) return toast('写点什么封存。');
    await api.capsules.create({ content, sealDays: days });
    setContent('');
    await refreshCapsules();
    toast(`封存 ${days} 天。到时见。`);
  };

  const tryOpen = async (id) => {
    try {
      const r = await api.capsules.open(id);
      await refreshCapsules();
      if (r.openAt) toast(`还没到 ${r.openAt}。`);
      else toast('拆开了。');
    } catch (e) {
      toast(e.message === 'not_yet' ? `还没到开放时间。` : '打不开。');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
      className="card p-6"
    >
      <h2 className="font-display text-xl mb-1">时间胶囊</h2>
      <p className="text-xs text-ink3 mb-4">封存一句话或一段话。到时间才能打开。</p>

      <textarea
        rows={4} className="textarea mb-3"
        value={content} onChange={e => setContent(e.target.value)}
        placeholder="此刻的心情、写下的字、给过去的自己……"
      />
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-ink3">封存</span>
        <input type="number" min="1" max="365" value={days} onChange={e => setDays(+e.target.value)} className="w-16 input py-1.5 text-sm" />
        <span className="text-xs text-ink3">天</span>
        <button onClick={seal} className="btn-primary btn-sm ml-auto">封存</button>
      </div>

      {capsules.length > 0 && (
        <div className="space-y-2 mt-3">
          {capsules.map(c => (
            <div key={c.id} className="border-t border-paper3/60 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink3">{c.sealedAt} · 封 {c.sealDays} 天</span>
                <span className={c.opened ? 'text-accent' : 'text-ink3'}>
                  {c.opened ? '已拆开' : `${c.openAt} 可开`}
                </span>
              </div>
              {c.opened ? (
                <p className="mt-1 text-ink2">{c.content}</p>
              ) : (
                <button
                  className="btn-text text-xs mt-1"
                  onClick={() => tryOpen(c.id)}
                >
                  试一下能不能打开
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function ExpeditionCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
      className="card p-6 col-span-full md:col-span-2"
    >
      <h2 className="font-display text-xl mb-1">出征令</h2>
      <p className="text-xs text-ink3 mb-5">考前一晚，如果想看一眼所有人的嘱托，就点一下。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.values(CHARACTERS).map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i }}
            className="p-4 rounded-lg border text-sm"
            style={{ borderColor: `${c.accent}40`, background: `${c.soft}80` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="stamp w-7 h-7 text-xs" style={{ color: c.accent, borderColor: c.accent }}>{c.stamp}</div>
              <span className="font-medium text-ink text-xs">{c.name}</span>
            </div>
            {(() => {
              const exp = EXPEDITION[c.id] || '加油。';
              const main = qMain(exp);
              const sub = qSub(exp);
              return (
                <p className="text-[11px] text-ink2 leading-relaxed">
                  {main}
                  {sub && <span className="block text-ink3 mt-0.5">{sub}</span>}
                </p>
              );
            })()}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function GraduationCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
      className="card p-6 col-span-full md:col-span-2"
    >
      <h2 className="font-display text-xl mb-1">毕业预演</h2>
      <p className="text-xs text-ink3 mb-4">考完那天，回来翻一翻。每个人都在场。</p>

      <div className="p-5 rounded-xl bg-gradient-to-br from-paper2/80 to-accent/5 border border-paper3/60">
        <div className="text-center">
          <div className="text-[10px] text-accent tracking-widest uppercase mb-2">
            CEREMONY · 预演
          </div>
          <div className="font-display italic text-2xl text-ink mb-4">
            上岸 · 今天
          </div>
          <div className="space-y-2 text-xs text-ink2 font-serif">
            {Object.values(CHARACTERS).map(c => (
              <div key={c.id}>
                <span style={{ color: c.accent }}>{c.name}</span>：
                「{farewellFor(c.id)}」
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function farewellFor(id) {
  return ({
    taylor: 'The next album is yours.',
    mariah: 'You left with the most dignity.',
    ali: '巴士到站啦。我挥挥手。',
    shinobu: '伤口都好了。',
    byakuya: '去吧。'
  })[id];
}
