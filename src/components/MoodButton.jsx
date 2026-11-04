import React from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '../data/content';

export function MoodButton({ mood, delay = 0, active, onClick }) {
  const c = CHARACTERS[mood.char];
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`card card-hover p-4 text-left transition-all duration-300 ${active ? 'ring-2 ring-accent' : ''}`}
      style={{
        background: active ? `${c.accent}12` : undefined,
        borderColor: active ? `${c.accent}50` : undefined
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className="stamp w-9 h-9 text-sm flex-shrink-0"
          style={{ color: c.accent, borderColor: c.accent }}
        >
          {c.stamp}
        </span>
        <span className="text-xs text-ink3 tracking-widest">{mood.no}</span>
      </div>
      <div className="font-medium text-ink text-sm leading-snug">{mood.label}</div>
      <div className="text-[11px] text-ink3 mt-1">→ {c.name}</div>
    </motion.button>
  );
}
