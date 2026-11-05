import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { todayKey } from '../lib/utils';
import { api } from '../lib/api';

const MODES = [
  { label: '专注 25', minutes: 25 },
  { label: '专注 50', minutes: 50 },
  { label: '短休 5',  minutes: 5 },
  { label: '长休 15', minutes: 15 }
];

export function Studio() {
  const [mode, setMode] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const subjectRef = useRef(null);
  const timerRef = useRef(null);
  const postFocus = useStore(s => s.postFocus);
  const tiny = useStore(s => s.tiny);
  const saveTiny = useStore(s => s.saveTiny);

  useEffect(() => {
    setSecondsLeft(MODES[mode].minutes * 60);
    setRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRunning(false);
          postFocus(MODES[mode].minutes, subjectRef.current?.value || null);
          return MODES[mode].minutes * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, mode]);

  const total = MODES[mode].minutes * 60;
  const pct = ((total - secondsLeft) / total) * 100;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  // Tiny list helpers
  const items = tiny?.items || [{ text: '', done: false }, { text: '', done: false }, { text: '', done: false }];
  const tinyDone = items.filter(i => i.done && i.text.trim()).length;

  const toggleTiny = (idx) => {
    const next = items.map((it, i) => i === idx ? { ...it, done: !it.done } : it);
    saveTiny(next);
  };
  const updateTiny = (idx, text) => {
    const next = items.map((it, i) => i === idx ? { ...it, text } : it);
    saveTiny(next);
  };

  return (
    <div className="container-wide pt-8">
      <div className="page-head">
        <div className="text-xs text-accent tracking-[0.18em] uppercase mb-2">STUDIO · 03</div>
        <h1 className="section-title">陪伴工具</h1>
        <p className="section-sub">不排名，不惩罚。断了不扣分，少做不警告。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 三件小事 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-xl">今天只做三件小事</h2>
            <span className="text-xs text-ink3">{tinyDone} / 3</span>
          </div>
          <p className="text-xs text-ink3 mb-4">写三件小到今天做得完的事。做完就打勾，不补昨天的账。</p>

          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-paper3/60 last:border-0">
                <input
                  type="checkbox"
                  checked={it.done}
                  onChange={() => toggleTiny(i)}
                  className="w-4 h-4 accent-accent rounded"
                />
                <span className="font-mono text-[10px] text-ink3 w-5">0{i + 1}</span>
                <input
                  type="text"
                  value={it.text}
                  onChange={e => updateTiny(i, e.target.value)}
                  placeholder={`例：${['背一单元单词', '写两道大题', '十一点前关灯'][i]}`}
                  className={`flex-1 bg-transparent border-0 focus:ring-0 text-sm ${it.done ? 'text-ink3 line-through' : 'text-ink'}`}
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* 番茄钟 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">番茄专注</h2>
            <div className="flex gap-1">
              {MODES.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMode(i)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    mode === i
                      ? 'bg-accent text-white'
                      : 'text-ink3 hover:text-ink'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 圆环 */}
          <div className="relative flex items-center justify-center my-6">
            <svg width="180" height="180" className="-rotate-90">
              <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="6" fill="none"
                className="text-paper3" />
              <motion.circle
                cx="90" cy="90" r="80"
                stroke="currentColor" strokeWidth="6" fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 80}
                className="text-accent"
                initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - pct / 100) }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono text-4xl tracking-wider">{mm}:{ss}</div>
              <input
                ref={subjectRef}
                type="text"
                placeholder="写什么呢？（可不填）"
                className="mt-2 text-xs bg-transparent border-0 text-center text-ink3 focus:ring-0 w-32"
              />
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setRunning(!running)}
              className="btn-primary"
            >
              {running ? '暂停' : '开始'}
            </button>
            <button
              onClick={() => { setSecondsLeft(MODES[mode].minutes * 60); setRunning(false); }}
              className="btn-ghost"
            >
              归零
            </button>
          </div>
        </motion.section>

        {/* 呼吸 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card p-6"
        >
          <h2 className="font-display text-xl mb-1">4-7-8 呼吸</h2>
          <p className="text-xs text-ink3 mb-5">四拍吸 · 七拍屏 · 八拍呼。三分钟，让心率先下来。</p>
          <Breathing />
        </motion.section>

        {/* 周计划 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="card p-6"
        >
          <h2 className="font-display text-xl mb-1">轻量计划</h2>
          <p className="text-xs text-ink3 mb-4">不是时间表，是大概的方向。随时可以改。</p>
          <WeeklyPlan />
        </motion.section>
      </div>
    </div>
  );
}

function Breathing() {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const timerRef = useRef(null);

  const start = () => {
    const steps = [
      { label: '吸 4', dur: 4000 },
      { label: '屏 7', dur: 7000 },
      { label: '呼 8', dur: 8000 }
    ];
    let i = 0;
    setCount(4);
    setPhase(steps[0].label);

    const step = () => {
      clearInterval(timerRef.current);
      const s = steps[i];
      setPhase(s.label);
      const [, target] = s.label.split(' ');
      let c = Number(target);
      setCount(c);
      const interval = setInterval(() => {
        c--;
        setCount(c);
        if (c <= 0) {
          clearInterval(interval);
          i = (i + 1) % steps.length;
          if (i === 0) setRound(r => r + 1);
          setTimeout(step, 200);
        }
      }, 1000);
      timerRef.current = interval;
    };
    step();
  };

  const stop = () => {
    clearInterval(timerRef.current);
    setPhase('idle');
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center py-4">
      <motion.div
        className="w-28 h-28 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center"
        animate={{
          scale: phase.startsWith('吸') ? 1.3 : phase.startsWith('呼') ? 0.85 : phase.startsWith('屏') ? 1.3 : 1,
          opacity: phase === 'idle' ? 0.5 : 1
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div className="text-center">
          <div className="font-mono text-3xl text-accent">{count || '·'}</div>
          <div className="text-[10px] text-ink3 tracking-widest uppercase mt-1">
            {phase === 'idle' ? '准备' : phase}
          </div>
        </div>
      </motion.div>

      <div className="mt-5 flex gap-2">
        {phase === 'idle' ? (
          <button onClick={start} className="btn-primary btn-sm">开始</button>
        ) : (
          <button onClick={stop} className="btn-ghost btn-sm">停止</button>
        )}
        <span className="text-xs text-ink3 self-center ml-2">第 {round} 轮</span>
      </div>
    </div>
  );
}

function WeeklyPlan() {
  const [subjects, setSubjects] = useState(['数学', '英语']);
  const [hours, setHours] = useState(35);
  const [plan, setPlan] = useState(null);

  const SUBJECTS = ['数学', '英语', '政治', '专业课一', '专业课二'];
  const DAYS = ['一', '二', '三', '四', '五', '六', '日'];

  useEffect(() => {
    let alive = true;
    api.plan.get().then(({ plan: p }) => {
      if (!alive || !p) return;
      if (Array.isArray(p.subjects) && p.subjects.length) setSubjects(p.subjects);
      if (p.hours) setHours(p.hours);
      if (p.matrix && Object.keys(p.matrix).length) setPlan(p.matrix);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const toggle = (s) => {
    setSubjects(subjects.includes(s) ? subjects.filter(x => x !== s) : [...subjects, s]);
  };

  const gen = () => {
    if (!subjects.length) return;
    const total = subjects.length * 7;
    const per = Math.max(1, Math.floor(hours / total));
    const matrix = {};
    subjects.forEach(s => { matrix[s] = Array(7).fill(0); });
    let remaining = hours - per * total;
    for (let i = 0; i < 7; i++) {
      subjects.forEach(s => {
        let add = per + (remaining > 0 ? 1 : 0);
        if (remaining > 0) remaining--;
        // 周末多一点
        if (i >= 5) add = Math.max(add, per + 1);
        matrix[s][i] = add;
      });
    }
    setPlan(matrix);
    api.plan.save({ subjects, hours, matrix }).catch(() => {});
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {SUBJECTS.map(s => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`chip ${subjects.includes(s) ? 'chip-is-on' : ''}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-ink3">每周</span>
        <input
          type="number"
          min="5"
          max="80"
          value={hours}
          onChange={e => setHours(+e.target.value)}
          className="w-20 input py-1.5 text-sm"
        />
        <span className="text-xs text-ink3">小时</span>
        <button onClick={gen} className="btn-primary btn-sm ml-auto">生成</button>
      </div>

      {plan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto"
        >
          <table className="w-full text-[11px] sm:text-xs">
            <thead>
              <tr className="text-ink3">
                <th className="text-left py-1.5 pr-1">科目</th>
                {DAYS.map(d => <th key={d} className="py-1.5">周{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.keys(plan).map(s => (
                <tr key={s} className="border-t border-paper3/60">
                  <td className="py-1.5 pr-1 font-medium text-ink whitespace-nowrap">{s}</td>
                  {plan[s].map((h, i) => (
                    <td key={i} className="py-1.5 text-center whitespace-nowrap">
                      {h ? `${h}h` : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
