// 环境音：用 Web Audio 生成的一段原创安静钢琴氛围乐（无音频文件、无版权风险）
import { useEffect, useRef, useState } from 'react';

const BPM = 64;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const LOOP_BARS = 4;
const LOOP = BAR * LOOP_BARS;

// 和弦（根音 + 和弦内音），频率单位 Hz
const CHORDS = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 392.0] // G
];

// 旋律动机（C 大调五声音阶，弱起、留白多，模仿轻声哼唱）
const MELODY = [
  { b: 2, f: 523.25, d: 1.6 },
  { b: 5, f: 587.33, d: 1.2 },
  { b: 7.5, f: 659.25, d: 1.8 },
  { b: 11, f: 523.25, d: 1.4 },
  { b: 13.5, f: 440.0, d: 1.8 }
];

function makeReverb(ctx) {
  const len = Math.floor(ctx.sampleRate * 1.4);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

function pluck(ctx, dest, freq, time, dur, gain) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  osc.type = 'sine';
  osc.frequency.value = freq;
  lp.type = 'lowpass';
  lp.frequency.value = 2400;
  lp.Q.value = 0.6;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(lp).connect(g).connect(dest);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function pad(ctx, dest, freq, time, dur) {
  [0, 1].forEach(i => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.value = freq * (i ? 1.004 : 1);
    lp.type = 'lowpass';
    lp.frequency.value = 780;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.035, time + 0.6);
    g.gain.setValueAtTime(0.035, time + dur - 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(lp).connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  });
}

export function AmbientMusic() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const timerRef = useRef(null);
  const nextLoopRef = useRef(0);
  const loopIndexRef = useRef(0);

  function scheduleLoop(ctx, master) {
    const start = nextLoopRef.current;
    const idx = loopIndexRef.current % CHORDS.length;

    // 四小节和弦铺底，每小节一个和弦
    for (let b = 0; b < LOOP_BARS; b++) {
      const chord = CHORDS[(idx + b) % CHORDS.length];
      const t = start + b * BAR;
      pad(ctx, master, chord[0], t, BAR * 1.05);
      // 每小节的分解和弦（8 个八分音符，跳过部分制造留白）
      [0, 2, 4, 6].forEach((step, k) => {
        pluck(ctx, master, chord[(k + 1) % chord.length], t + step * (BEAT / 2), 1.1, 0.05);
      });
    }

    // 旋律
    MELODY.forEach(n => {
      pluck(ctx, master, n.f, start + n.b * BEAT, n.d, 0.06);
    });

    loopIndexRef.current += LOOP_BARS;
    nextLoopRef.current = start + LOOP;
  }

  function tick() {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master || ctx.state !== 'running') return;
    while (nextLoopRef.current < ctx.currentTime + 2.2) {
      scheduleLoop(ctx, master);
    }
  }

  async function start() {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const master = ctx.createGain();
      const reverb = makeReverb(ctx);
      master.gain.value = 0;
      master.connect(ctx.destination);
      // 干声 + 少量混响
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      master.connect(reverb).connect(wet).connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
      nextLoopRef.current = ctx.currentTime + 0.15;
      loopIndexRef.current = 0;
    }
    const ctx = ctxRef.current;
    await ctx.resume();
    masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, ctx.currentTime);
    masterRef.current.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.8);
    tick();
    timerRef.current = setInterval(tick, 400);
  }

  function stop() {
    const ctx = ctxRef.current;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (ctx && masterRef.current) {
      masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, ctx.currentTime);
      masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    }
  }

  function toggle() {
    const next = !on;
    setOn(next);
    localStorage.setItem('haven.bgm', next ? '1' : '0');
    if (next) start();
    else stop();
  }

  // 切到后台时静音，回来时恢复
  useEffect(() => {
    function onVisible() {
      const ctx = ctxRef.current;
      if (!ctx || !on) return;
      if (document.hidden) ctx.suspend();
      else {
        ctx.resume();
        tick();
        if (!timerRef.current) timerRef.current = setInterval(tick, 400);
      }
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [on]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={on ? '关闭环境音' : '播放环境音'}
      className={`fixed right-5 bottom-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full
        text-[11px] tracking-wide transition-all duration-300 shadow-soft
        ${on
          ? 'bg-accent text-white border border-accent-dark/30'
          : 'bg-white/70 text-ink3 border border-paper3 hover:text-accent hover:border-accent/40'}`}
    >
      {on ? (
        <span className="flex items-end gap-[3px] h-3" aria-hidden>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="eq-bar w-[2px] bg-white/80 rounded-sm"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </span>
      ) : (
        <span aria-hidden className="text-sm leading-none">♪</span>
      )}
      <span className="whitespace-nowrap">{on ? '环境音 · 开' : '环境音'}</span>
    </button>
  );
}
