import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CHARACTERS } from '../data/content';
import { useStore } from '../store';

export function Hall() {
  const profile = useStore(s => s.profile);
  const visited = useStore(s => s.favs.map(f => f.charId)); // 用金句本代替

  const list = Object.values(CHARACTERS);

  return (
    <div className="container-wide pt-8">
      <div className="page-head">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs text-accent tracking-[0.18em] uppercase mb-2">HALL · 02</div>
          <h1 className="section-title">角色馆</h1>
          <p className="section-sub">五扇门。推开哪一扇，都有人在等。</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/char/${c.id}`}
              className="card card-hover block overflow-hidden group"
            >
              <div
                className="h-24 relative"
                style={{
                  background: `linear-gradient(135deg, ${c.accent}20 0%, ${c.soft} 100%)`
                }}
              >
                <div className="absolute -right-3 -bottom-3 font-display italic text-[120px] leading-none opacity-10 text-current" style={{ color: c.accent }}>
                  {c.stamp}
                </div>
                <div className="absolute left-5 top-4">
                  <div
                    className="stamp w-12 h-12 text-base"
                    style={{ color: c.accent, borderColor: c.accent }}
                  >
                    {c.stamp}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-xl">{c.name}</h3>
                  <span className="text-[10px] text-ink3 tracking-widest uppercase">{c.role}</span>
                </div>
                <p className="text-[11px] text-ink3 italic">{c.en}</p>
                <p className="text-sm text-ink2 mt-3 leading-relaxed">{c.short}</p>

                <div className="mt-4 pt-4 border-t border-paper3/60 flex items-center justify-between">
                  <span className="text-xs text-accent font-medium">
                    {c.tagline}
                  </span>
                  <span className="text-xs text-ink3 group-hover:text-accent transition-colors">
                    推门 →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
