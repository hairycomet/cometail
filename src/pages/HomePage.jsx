import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import MiniMe from '../components/MiniMe';
import {
  IconBell, IconSettings, IconFlame, IconStar,
  IconTrophy, IconNotebook, IconKeyboard, IconChevronRight,
  IconSparkles, IconComet,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

export default function HomePage() {
  const { userProfile, toggleTheme, theme } = useStore();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [featuredDiary, setFeaturedDiary] = useState(null);
  const [todayWritten, setTodayWritten] = useState(false);

  useEffect(() => {
    if (!userProfile) return;
    fetchLeaderboard();
    fetchFeatured();
    checkTodayDiary();
  }, [userProfile]);

  const fetchLeaderboard = async () => {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(5));
    const snap = await getDocs(q);
    setLeaderboard(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchFeatured = async () => {
    const q = query(collection(db, 'diaries'), where('featured', '==', true), orderBy('featuredAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) setFeaturedDiary({ id: snap.docs[0].id, ...snap.docs[0].data() });
  };

  const checkTodayDiary = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const q = query(
      collection(db, 'diaries'),
      where('uid', '==', userProfile.uid),
      where('date', '==', today),
    );
    const snap = await getDocs(q);
    setTodayWritten(!snap.empty);
  };

  const getHour = () => new Date().getHours();
  const greeting = getHour() < 12 ? 'Good morning' : getHour() < 17 ? 'Good afternoon' : 'Good evening';

  const levelTitle = (lv) => {
    const titles = { 1: 'Beginner', 2: 'Beginner', 3: 'Writer', 4: 'Writer', 5: 'Storyteller', 6: 'Storyteller', 7: 'Author', 8: 'Author', 9: 'Legend', 10: 'Legend' };
    return titles[lv] || 'Legend';
  };

  const xpForLevel = (lv) => lv * 1000;
  const xpProgress = userProfile ? (userProfile.xp || 0) % xpForLevel(userProfile.level) : 0;
  const xpPercent = userProfile ? (xpProgress / xpForLevel(userProfile.level)) * 100 : 0;

  const rankColors = [
    { bg: 'var(--amber-50)', color: 'var(--amber-800)' },
    { bg: 'var(--gray-100)', color: 'var(--gray-600)' },
    { bg: '#FFF3E0', color: '#854F0B' },
  ];

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 90 }}>
      {/* Top bar */}
      <div style={{
        padding: '52px 20px 16px',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconComet size={17} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-main)', fontSize: 17, fontWeight: 900, color: 'var(--purple-800)' }}>
            Cometail
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme} style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 16 }}>{theme === 'light' ? '🌙' : '☀️'}</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconBell size={17} color="var(--text-secondary)" />
          </motion.button>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Character zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, var(--purple-50), var(--purple-100))',
            borderRadius: 'var(--radius-xl)', padding: '16px',
            border: '1.5px solid var(--purple-200)',
            display: 'flex', gap: 14, alignItems: 'flex-end',
            marginBottom: 12,
          }}
        >
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <MiniMe equipped={userProfile?.equipped || {}} size={90} />
            <span style={{
              background: 'var(--purple-600)', color: 'white',
              fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 20,
            }}>
              {userProfile?.nickname || 'Player'}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: 'var(--purple-400)', marginBottom: 2 }}>{greeting}!</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--purple-900)', marginBottom: 10 }}>
              {todayWritten ? "Great job writing today! ✨" : "Ready to write today? ✏️"}
            </p>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'var(--purple-600)', color: 'white',
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  Lv {userProfile?.level || 1} · {levelTitle(userProfile?.level || 1)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--purple-400)' }}>{xpProgress} / {xpForLevel(userProfile?.level || 1)} xp</span>
              </div>
              <div style={{ height: 6, background: 'var(--purple-200)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--purple-600)', borderRadius: 3 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconFlame size={16} color="#E24B4A" />
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--purple-900)' }}>
                {userProfile?.streak || 0}-day streak
              </span>
            </div>
          </div>
        </motion.div>

        {/* HUD stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { icon: IconStar, label: 'Points', value: (userProfile?.points || 0).toLocaleString(), color: 'var(--amber-600)' },
            { icon: IconTrophy, label: 'Ranking', value: '#4', color: 'var(--purple-600)' },
            { icon: IconNotebook, label: 'Diaries', value: userProfile?.totalDiaries || 0, color: 'var(--teal-600)' },
            { icon: IconKeyboard, label: 'Best wpm', value: `${userProfile?.typingBest || 0}`, color: 'var(--purple-400)' },
          ].map(({ icon: Icon, label, value, color }) => (
            <motion.div key={label} whileTap={{ scale: 0.97 }} style={{
              background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)',
              padding: '12px 14px', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today's diary CTA */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/diary/new')}
          style={{
            background: todayWritten
              ? 'var(--green-50)'
              : 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
            borderRadius: 'var(--radius-lg)', padding: '16px',
            marginBottom: 12, cursor: 'pointer',
            border: todayWritten ? '1.5px solid var(--teal-400)' : 'none',
          }}
        >
          <p style={{ fontSize: 11, color: todayWritten ? 'var(--teal-600)' : 'rgba(255,255,255,0.7)', marginBottom: 3, fontWeight: 700 }}>
            {todayWritten ? '✅ Today written!' : `📅 ${dayjs().format('dddd, MMMM D')}`}
          </p>
          <p style={{ fontSize: 15, fontWeight: 800, color: todayWritten ? 'var(--teal-800)' : 'white', marginBottom: todayWritten ? 0 : 12 }}>
            {todayWritten ? 'You wrote today — great streak! 🔥' : "What happened today? Write it in English ✏️"}
          </p>
          {!todayWritten && (
            <div style={{
              background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)',
              padding: '9px', textAlign: 'center',
              color: 'white', fontWeight: 800, fontSize: 14,
            }}>
              Start writing · +10 pt
            </div>
          )}
        </motion.div>

        {/* Featured diary */}
        {featuredDiary && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                This week's pick
              </span>
            </div>
            <motion.div whileTap={{ scale: 0.98 }} style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  background: 'var(--amber-50)', color: 'var(--amber-800)',
                  fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
                }}>
                  ☄️ Comet's pick
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>by {featuredDiary.nickname}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {featuredDiary.content}
              </p>
            </motion.div>
          </div>
        )}

        {/* Leaderboard */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Leaderboard
            </span>
            <button onClick={() => navigate('/leaderboard')} style={{
              fontSize: 12, color: 'var(--purple-600)', fontWeight: 700, background: 'none',
              display: 'flex', alignItems: 'center', gap: 2,
            }}>
              See all <IconChevronRight size={14} />
            </button>
          </div>
          <div style={{
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          }}>
            {leaderboard.map((u, i) => {
              const isMe = u.id === userProfile?.uid;
              return (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px',
                  background: isMe ? 'var(--purple-50)' : 'transparent',
                  borderBottom: i < leaderboard.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{
                    width: 20, textAlign: 'center', fontSize: 13, fontWeight: 800,
                    color: i < 3 ? rankColors[i].color : 'var(--text-tertiary)',
                  }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </span>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: isMe ? 'var(--purple-200)' : 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                    color: isMe ? 'var(--purple-800)' : 'var(--text-secondary)',
                    flexShrink: 0,
                  }}>
                    {u.nickname?.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isMe ? 800 : 500, color: isMe ? 'var(--purple-800)' : 'var(--text-primary)' }}>
                    {u.nickname} {isMe && '(me)'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isMe ? 'var(--purple-600)' : 'var(--text-secondary)' }}>
                    {(u.points || 0).toLocaleString()} pt
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
