import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CHARACTERS, MOODS, LINES, DAILY_QUOTES, CHAPTER_LINES, eraFor, EXAM_DEFAULT } from '../data/content';
import { useStore } from '../store';
import { todayKey, diffDays, pickBy, hashStr, qMain, qSub, cnWeekday } from '../lib/utils';
import { MoodButton } from '../components/MoodButton';
import { ResultCard } from '../components/ResultCard';

export function Home() {
  const profile = useStore(s => s.profile);
  const stats = useStore(s => s.stats);
  const todayCheckin = useStore(s => s.todayCheckin);
  const postCheckin = useStore(s => s.postCheckin);
  const acceptToday = useStore(s => s.acceptToday);

  const [moodOpen, setMoodOpen] = useState(false);
  const [dayQuote, setDayQuote] = useState(null);
  const [chapterLine, setChapterLine] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [era, setEra] = useState(null);
  const [today, setToday] = useState(new Date());
  const [lineType, setLineType] = useState('en'); // 'en' | 'cn' | 'both'

  useEffect(() => {
    const t = new Date();
    setToday(t);
    const exam = new Date(profile.examDate || EXAM_DEFAULT);
    const left = diffDays(t, exam);
    setDaysLeft(left);
    setEra(eraFor(left));

    const key = todayKey(t);
    const q = pickBy(DAILY_QUOTES, hashStr(key + 'quote'));
    setDayQuote(q);

    const lines = CHAPTER_LINES[eraFor(left).id];
    const line = pickBy(lines, hashStr(key + 'chapter'));
    setChapterLine(line);
  }, [profile.examDate]);

  const handleMood = async (moodId) => {
    const mood = MOODS.find(m => m.id === moodId);
    if (!mood) return;
    const charLines = LINES[mood.char]?.[moodId] || [''];
    const line = charLines[Math.floor(Math.random() * charLines.length)];
    await postCheckin(moodId, mood.char, line, false);
    setMoodOpen(true);
  };

  return (
    <div className="container-narrow pt-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-ink3 tracking-[0.18em] uppercase">
            {today.getFullYear()} · {String(today.getMonth()+1).padStart(2,'0')}·{String(today.getDate()).padStart(2,'0')}
            {' · 星期' + cnWeekday(today)}
          </div>
          <div className="text-xs text-ink3 tracking-[0.14em]">
            NO.{String((stats.totalDays || 0) + 1).padStart(3, '0')}
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="text-[120px] leading-none font-display text-accent/10 select-none">
            {daysLeft > 0 ? daysLeft : 0}
          </div>
          <div className="pt-4">
            <div className="text-xs text-accent tracking-[0.18em] uppercase mb-2">
              {daysLeft >= 0 ? '离初试还有' : '初试已过'}
            </div>
            <h1 className="font-display text-3xl md:text-4xl leading-tight text-ink">
              今天是 <span className="text-accent">{era?.name}</span> 的一天
            </h1>
            {chapterLine && (
              <p className="mt-3 text-sm text-ink2 leading-relaxed font-serif">
                {typeof chapterLine === 'string' ? chapterLine : chapterLine.cn}
              </p>
            )}
          </div>
        </div>

        {/* 章节进度条 */}
        <div className="mt-8 flex gap-1">
          {['foundation', 'build', 'sprint', 'final'].map((id, i) => {
            const e = eraFor(daysLeft);
            const idx = ['foundation', 'build', 'sprint', 'final'].indexOf(e.id);
            const isOn = i <= idx;
            return (
              <div key={id} className="flex-1 h-1 rounded-full overflow-hidden bg-paper3/60">
                <motion.div
                  initial={false}
                  animate={{ width: isOn ? '100%' : '0%', opacity: isOn ? 1 : 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full"
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-ink3 tracking-wider">
          <span>地基期</span><span>编曲期</span><span>冲刺期</span><span>上台期</span>
        </div>
      </motion.section>

      {/* 情绪分诊 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 className="section-title">今天，你怎么样？</h2>
          <span className="text-xs text-ink3">选一个，有人来找你。</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {MOODS.map((m, i) => (
            <MoodButton
              key={m.id}
              mood={m}
              delay={i * 0.06}
              active={todayCheckin?.moodId === m.id}
              onClick={() => handleMood(m.id)}
            />
          ))}
        </div>

        {/* 结果卡 */}
        <AnimatePresence>
          {moodOpen && todayCheckin && (
            <ResultCard
              checkin={todayCheckin}
              accepted={todayCheckin.accepted}
              onAccept={acceptToday}
              onClose={() => setMoodOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.section>

      {/* 今日一句 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card p-6 md:p-8 mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-ink3 tracking-[0.14em] uppercase">
            <span>今日一句</span>
            {dayQuote && (
              <>
                <span>·</span>
                <span className="text-accent">{CHARACTERS[dayQuote.char].name}</span>
              </>
            )}
          </div>
          <button
            onClick={() => setLineType(lineType === 'both' ? 'en' : lineType === 'en' ? 'cn' : 'both')}
            className="text-xs text-ink3 hover:text-accent transition-colors"
          >
            {lineType === 'both' ? '只看英文' : lineType === 'en' ? '只看中文' : '双语'}
          </button>
        </div>

        {dayQuote && (
          <div>
            {lineType !== 'cn' && (
              <p className="quote-en">{qMain(dayQuote.text)}</p>
            )}
            {lineType !== 'en' && qSub(dayQuote.text) && (
              <p className="quote-cn">{qSub(dayQuote.text)}</p>
            )}
          </div>
        )}
      </motion.section>

      {/* 快捷入口 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/hall',    title: '角色馆', desc: '五个人，五种姿态' },
            { to: '/studio',  title: '陪伴工具', desc: '番茄 / 呼吸 / 计划' },
            { to: '/ritual',  title: '仪式',   desc: '胶囊 / 出征令' },
            { to: '/circle',  title: '研友圈', desc: '在场 · 墙 · 日历' }
          ].map((c, i) => (
            <Link
              key={c.to}
              to={c.to}
              className="card card-hover p-5 text-left group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="font-display text-lg text-ink group-hover:text-accent transition-colors">
                {c.title}
              </div>
              <div className="text-xs text-ink3 mt-1.5">{c.desc}</div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
