import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CHARACTERS, LINES } from '../data/content';
import { useStore } from '../store';

export function Character() {
  const { id } = useParams();
  const c = CHARACTERS[id];
  const addFav = useStore(s => s.addFav);
  const toast = useStore(s => s.toast);

  if (!c) return <Navigate to="/hall" />;

  const charLines = LINES[id] || {};
  const lineKeys = Object.keys(charLines);

  return (
    <div className="container-narrow pt-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 md:p-10 mb-8 overflow-hidden relative"
      >
        <div
          className="absolute -right-10 -top-6 font-display italic text-[160px] leading-none opacity-10 select-none"
          style={{ color: c.accent }}
        >
          {c.stamp}
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-5">
            <div
              className="stamp w-16 h-16 text-xl"
              style={{ color: c.accent, borderColor: c.accent }}
            >
              {c.stamp}
            </div>
            <div>
              <div className="font-display text-2xl">{c.name}</div>
              <div className="text-xs text-ink3 italic">{c.en}</div>
              <div className="text-[10px] text-ink3 tracking-widest uppercase mt-1">{c.role}</div>
            </div>
          </div>

          {c.quote && (
            <div className="mt-4 mb-4 border-l-2 pl-4" style={{ borderColor: c.accent }}>
              {typeof c.quote === 'string' ? (
                <p className="quote-en">{c.quote}</p>
              ) : (
                <>
                  <p className="quote-en">{c.quote.en}</p>
                  {c.quote.cn && <p className="quote-cn">{c.quote.cn}</p>}
                </>
              )}
            </div>
          )}

          <p className="text-sm text-ink2 leading-relaxed max-w-xl">{c.bio}</p>

          <div className="mt-5 p-3 rounded-lg bg-paper2/60 border border-paper3 text-xs">
            <span className="font-medium text-accent">OOC 红线</span>
            <span className="text-ink3 ml-2">{c.ooc}</span>
          </div>
        </div>
      </motion.section>

      {/* 互动：让 TA 说一句 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="card p-6 mb-6"
      >
        <div className="section-title text-xl mb-2">让 {c.name} 说一句</div>
        <p className="section-sub mb-5">选一个心情，TA 会说你此刻需要听的话。</p>

        <div className="space-y-4">
          {lineKeys.map((mood, i) => {
            const pool = charLines[mood] || [];
            return (
              <MoodGroup
                key={mood}
                title={moodLabel(mood)}
                lines={pool}
                charId={id}
                accent={c.accent}
                delay={i * 0.06}
                onFav={(line) => addFav(id, line)}
              />
            );
          })}
        </div>
      </motion.section>

      <Link to="/hall" className="btn-ghost btn-sm">← 回到角色馆</Link>
    </div>
  );
}

function MoodGroup({ title, lines, charId, accent, delay, onFav }) {
  const [revealed, setRevealed] = useState(null);

  const pick = () => {
    const next = lines[Math.floor(Math.random() * lines.length)];
    setRevealed(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="border-b border-paper3/60 pb-4 last:border-0"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: accent }}>{title}</span>
        <button onClick={pick} className="btn-text btn-sm" style={{ color: accent }}>
          让 TA 说 →
        </button>
      </div>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pl-3 border-l-2"
          style={{ borderColor: accent }}
        >
          {typeof revealed === 'string' ? (
            <p className="text-sm text-ink leading-relaxed">{revealed}</p>
          ) : (
            <>
              <p className="quote-en text-base">{revealed.en}</p>
              {revealed.cn && <p className="quote-cn">{revealed.cn}</p>}
            </>
          )}
          <button
            className="btn-text text-xs mt-2"
            onClick={() => onFav(revealed)}
          >
            收进金句本
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function moodLabel(id) {
  return { collapse: '崩溃时', quit: '想放弃时', judged: '被否定时', lonely: '孤独时', empty: '空掉时' }[id] || id;
}
