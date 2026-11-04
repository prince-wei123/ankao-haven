import React, { useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Hall } from './pages/Hall';
import { Character } from './pages/Character';
import { Studio } from './pages/Studio';
import { Ritual } from './pages/Ritual';
import { Circle } from './pages/Circle';
import { Me } from './pages/Me';
import { AmbientMusic } from './components/AmbientMusic';
import { useStore } from './store';

const NAV = [
  { to: '/',      label: '今日',     icon: '☀' },
  { to: '/hall',  label: '角色馆',   icon: '☾' },
  { to: '/studio',label: '工具',     icon: '◆' },
  { to: '/ritual',label: '仪式',     icon: '✦' },
  { to: '/circle',label: '研友',     icon: '◈' },
  { to: '/me',    label: '我的',     icon: '✧' }
];

export default function App() {
  const boot = useStore(s => s.boot);
  const loading = useStore(s => s.loading);
  const toast = useStore(s => s.toast);
  const navigate = useNavigate();

  useEffect(() => { boot(); }, [boot]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-4xl text-accent animate-pulse-soft">岸</div>
          <p className="text-xs text-ink3 mt-3 tracking-widest">正在翻页…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 glass border-b border-paper3/60">
        <div className="container-wide flex items-center justify-between h-14">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <span className="stamp w-8 h-8 text-sm text-accent group-hover:scale-110 transition-transform">岸</span>
            <span className="font-display text-lg tracking-wide">岸上见</span>
            <span className="hidden sm:inline text-[10px] text-ink3 tracking-[0.2em] uppercase ml-1">
              Haven
            </span>
          </button>

          <nav className="flex items-center gap-1">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-accent-dark bg-accent/10 font-medium'
                      : 'text-ink3 hover:text-ink2 hover:bg-paper2/60'
                  }`
                }
              >
                <span className="hidden md:inline">{n.label}</span>
                <span className="md:hidden">{n.icon}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* 路由 */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrap><Home /></PageWrap>} />
            <Route path="/hall" element={<PageWrap><Hall /></PageWrap>} />
            <Route path="/char/:id" element={<PageWrap><Character /></PageWrap>} />
            <Route path="/studio" element={<PageWrap><Studio /></PageWrap>} />
            <Route path="/ritual" element={<PageWrap><Ritual /></PageWrap>} />
            <Route path="/circle" element={<PageWrap><Circle /></PageWrap>} />
            <Route path="/me" element={<PageWrap><Me /></PageWrap>} />
            <Route path="*" element={<PageWrap><Home /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-paper3/60 py-8 text-center text-xs text-ink3">
        <p className="font-display italic">She'll remember this winter.</p>
        <p className="mt-1 tracking-widest">岸上见 · 备考避难所 · v2.0</p>
        <a
          href="https://www.youtube.com/results?search_query=Mariah+Carey+Through+the+Rain"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[11px] text-ink3/80 underline decoration-paper3 underline-offset-4 hover:text-accent transition-colors"
        >
          想听原曲：Mariah Carey《Through the Rain》↗
        </a>
      </footer>

      {/* 环境音开关 */}
      <AmbientMusic />

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-ink text-paper text-sm shadow-card"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}

function PageWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
