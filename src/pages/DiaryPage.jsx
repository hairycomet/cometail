import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import { IconPlus, IconNotebook, IconChevronRight, IconStar } from '@tabler/icons-react';
import dayjs from 'dayjs';

export default function DiaryPage() {
  const navigate = useNavigate();
  const { user, userProfile } = useStore();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const q = query(
        collection(db, 'diaries'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setDiaries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetch();
  }, [user]);

  const today = dayjs().format('YYYY-MM-DD');
  const writtenToday = diaries.some(d => d.date === today);

  // Build calendar data for last 10 weeks
  const calendarDays = [];
  for (let i = 69; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    calendarDays.push({
      date,
      written: diaries.some(d => d.date === date),
      isToday: date === today,
    });
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-main)', color: 'var(--text-primary)' }}>My Diary</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{diaries.length} entries total</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/diary/new')}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(83,74,183,0.4)',
          }}
        >
          <IconPlus size={20} color="white" />
        </motion.button>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Today CTA */}
        {!writtenToday && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/diary/new')}
            style={{
              background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
              borderRadius: 'var(--radius-lg)', padding: '16px',
              marginBottom: 16, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(83,74,183,0.3)',
            }}
          >
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: 4 }}>TODAY · {dayjs().format('MMM D')}</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 12 }}>Write today's diary ✏️</p>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px', textAlign: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>
              Start writing · +10 pt
            </div>
          </motion.div>
        )}

        {/* Calendar heatmap */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Last 10 weeks</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
            {calendarDays.map((day) => (
              <div key={day.date} style={{
                aspectRatio: '1', borderRadius: 4,
                background: day.written ? 'var(--purple-600)' : day.isToday ? 'var(--purple-100)' : 'var(--bg-tertiary)',
                border: day.isToday ? '2px solid var(--purple-400)' : 'none',
                transition: 'all 0.2s',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--purple-600)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Written</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bg-tertiary)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Missed</span>
            </div>
          </div>
        </div>

        {/* Diary list */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : diaries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📓</div>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>No diaries yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Write your first diary to start your streak!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {diaries.map((diary, i) => (
              <motion.div
                key={diary.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card"
                style={{ padding: '14px 16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: diary.featured ? 'var(--amber-50)' : 'var(--purple-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    {diary.featured ? '⭐' : '📝'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {dayjs(diary.date).format('MMM D, YYYY')}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{diary.wordCount} words</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {diary.content}
                    </p>
                    {diary.feedback && (
                      <div style={{ marginTop: 8, padding: '6px 10px', background: 'var(--purple-50)', borderRadius: 8, fontSize: 12, color: 'var(--purple-800)' }}>
                        ☄️ {diary.feedback}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
