import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CHARACTERS } from '../data/content';
import { qMain, qSub } from '../lib/utils';

export function ResultCard({ checkin, accepted, onAccept, onClose, onRefresh }) {
  const c = CHARACTERS[checkin.charId];
  const line = checkin.line;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35 }}
      className="card p-6 md:p-7 mt-5 overflow-hidden relative"
      style={{ borderColor: `${c.accent}40` }}
    >
      <div
        className="absolute -right-8 -top-8 font-display italic text-[140px] leading-none opacity-10"
        style={{ color: c.accent }}
      >
        {c.stamp}
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="stamp w-14 h-14 text-lg"
            style={{ color: c.accent, borderColor: c.accent }}
          >
            {c.stamp}
          </div>
          <div>
            <div className="font-display text-xl">{c.name}</div>
            <div className="text-[10px] text-ink3 tracking-widest uppercase">{c.role}</div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-ink3 hover:text-ink text-xs"
          >
            ✕
          </button>
        </div>

        {line && (line.en || line.cn) && (
          <div className="border-l-2 pl-4 my-4" style={{ borderColor: c.accent }}>
            {typeof line === 'string' ? (
              <p className="quote-en text-lg">{line}</p>
            ) : (
              <>
                {line.en && <p className="quote-en text-lg">{line.en}</p>}
                {line.cn && <p className="quote-cn">{line.cn}</p>}
              </>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          {!accepted ? (
            <button onClick={onAccept} className="btn-primary">
              收下这句话
            </button>
          ) : (
            <span className="text-xs text-accent font-medium px-3 py-1.5 bg-accent/10 rounded-full">
              已收下 · 今天记了一次签到
            </span>
          )}
          {!accepted && onRefresh && (
            <button onClick={onRefresh} className="btn-ghost">
              换一句 ↻
            </button>
          )}
          <Link
            to={`/char/${checkin.charId}`}
            className="btn-ghost"
            onClick={onClose}
          >
            去 TA 的房间 →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
