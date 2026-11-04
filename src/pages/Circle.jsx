import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { api } from '../lib/api';

export function Circle() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');
  const toast = useStore(s => s.toast);

  const load = async () => {
    try {
      const r = await api.wall.list();
      setPosts(r.posts);
    } catch (_) {}
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!content.trim()) return toast('写一句话再贴。');
    await api.wall.post({ content, nickname });
    setContent(''); setNickname('');
    await load();
    toast('贴上去了。今天多了一个人。');
  };

  return (
    <div className="container-wide pt-8">
      <div className="page-head">
        <div className="text-xs text-accent tracking-[0.18em] uppercase mb-2">CIRCLE · 05</div>
        <h1 className="section-title">研友圈</h1>
        <p className="section-sub">公开的墙。谁都可以贴，谁都可以看。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 发帖 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 lg:col-span-1 h-fit"
        >
          <h2 className="font-display text-lg mb-4">贴上墙</h2>
          <input
            className="input mb-2"
            placeholder="昵称（匿名也行）"
            value={nickname} onChange={e => setNickname(e.target.value)}
          />
          <textarea
            rows={4} className="textarea mb-3"
            placeholder="今天也来了 / 崩了又坐下了 / 刚写完第一道大题……"
            value={content} onChange={e => setContent(e.target.value)}
          />
          <button onClick={submit} className="btn-primary btn-sm w-full">贴上去</button>
          <p className="text-[10px] text-ink3 mt-3">本墙不显示任何个人数据。匿名也可以。</p>
        </motion.section>

        {/* 墙 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            {posts.length === 0 && (
              <div className="card p-8 text-center text-sm text-ink3">
                还没有研友贴墙。做第一个吧。
              </div>
            )}
            {posts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="stamp w-7 h-7 text-xs" style={{ color: '#b5833d', borderColor: '#b5833d' }}>?</div>
                  <span className="font-medium text-sm">{p.nickname}</span>
                  <span className="text-[10px] text-ink3 ml-auto">{p.createdAt}</span>
                </div>
                <p className="text-sm text-ink2 leading-relaxed">{p.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
