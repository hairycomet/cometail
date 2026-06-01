import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import MiniMe from '../components/MiniMe';
import { IconBell, IconMoon, IconSun, IconStar, IconTrophy, IconNotebook, IconKeyboard, IconFlame, IconChevronRight, IconComet } from '@tabler/icons-react';
import dayjs from 'dayjs';

export default function HomePage() {
  const { userProfile, toggleTheme, theme } = useStore();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [featuredDiary, setFeaturedDiary] = useState(null);
  const [todayWritten, setTodayWritten] = useState(false);
  const user = useStore(s => s.user);

  useEffect(() => {
    if (!userProfile) return;
    fetchData();
  }, [userProfile]);

  const fetchData = async () => {
    const [lbSnap, featSnap, todaySnap] = await Promise.all([
      getDocs(query(collection(db, 'users'), orderBy('points', 'desc'), limit(5))),
      getDocs(query(collection(db, 'diaries'), where('featured', '==', true), orderBy('featuredAt', 'desc'), limit(1))),
      getDocs(query(collection(db, 'diaries'), where('uid', '==', user?.uid), where('date', '==', dayjs().format('YYYY-MM-DD')))),
    ]);
    setLeaderboard(lbSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    if (!featSnap.empty) setFeaturedDiary({ id: featSnap.docs[0].id, ...featSnap.docs[0].data() });
    setTodayWritten(!todaySnap.empty);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const lv = userProfile?.level || 1;
  const xp = (userProfile?.xp || 0) % (lv * 1000);
  const xpPct = Math.min((xp / (lv * 1000)) * 100, 100);
  const lvNames = ['', 'Beginner', 'Beginner', 'Writer', 'Writer', 'Storyteller', 'Storyteller', 'Author', 'Author', 'Legend', 'Legend'];

  const MEDAL = ['🥇', '🥈', '🥉'];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: 'calc(52px + env(safe-area-inset-top, 0px)) 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComet size={17} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-main)', fontSize: 18, fontWeight: 900, color: 'var(--purple-800)' }}>Cometail</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'light' ? <IconMoon size={16} color="var(--text-secondary)" /> : <IconSun size={16} color="var(--text-secondary)" />}
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBell size={16} color="var(--text-secondary)" />
          </motion.button>
        </div>
      </div>

      <div style={{ padding: '14px 14px 0' }}>
        {/* Character zone */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, var(--purple-50) 0%, var(--purple-100) 100%)', borderRadius: 'var(--radius-xl)', padding: '16px', marginBottom: 12, border: '1.5px solid var(--purple-200)', display: 'flex', gap: 14, alignItems: 'flex-end' }}>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <MiniMe equipped={userProfile?.equipped || {}} size={86} />
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--purple-600)', background: 'white', padding: '2px 10px', borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}>
              {userProfile?.nickname || 'Player'}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: 'var(--purple-400)', fontWeight: 600, marginBottom: 2 }}>{greeting}!</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--purple-900)', fontFamily: 'var(--font-main)', marginBottom: 10, lineHeight: 1.3 }}>
              {todayWritten ? 'Great job today! ✨' : 'Ready to write? ✏️'}
            </p>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--purple-600)', color: 'white', padding: '2px 8px', borderRadius: 20 }}>Lv {lv} · {lvNames[lv]}</span>
                <span style={{ fontSize: 11, color: 'var(--purple-400)' }}>{xp}/{lv * 1000} xp</span>
              </div>
              <div style={{ height: 5, background: 'var(--purple-200)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--purple-600)', borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconFlame size={15} color="#E24B4A" />
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--purple-900)' }}>{userProfile?.streak || 0}-day streak</span>
            </div>
          </div>
        </motion.div>

        {/* HUD stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { icon: IconStar, label: 'Points', value: (userProfile?.points || 0).toLocaleString(), color: 'var(--amber-600)', bg: 'var(--amber-50)' },
            { icon: IconTrophy, label: 'Rank', value: `#${leaderboard.findIndex(u => u.id === user?.uid) + 1 || '—'}`, color: 'var(--purple-600)', bg: 'var(--purple-50)' },
            { icon: IconNotebook, label: 'Diaries', value: userProfile?.totalDiaries || 0, color: 'var(--teal-600)', bg: 'var(--teal-50)' },
            { icon: IconKeyboard, label: 'Best wpm', value: userProfile?.typingBest || 0, color: 'var(--purple-400)', bg: 'var(--purple-50)' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <motion.div key={label} whileTap={{ scale: 0.96 }}
              className="card" style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today's diary CTA */}
        <motion.div whileTap={{ scale: 0.98 }} onClick={() => navigate('/diary/new')}
          style={{
            background: todayWritten ? 'var(--teal-50)' : 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
            borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 12, cursor: 'pointer',
            border: todayWritten ? '1.5px solid var(--teal-400)' : 'none',
            boxShadow: todayWritten ? 'none' : '0 6px 20px rgba(83,74,183,0.3)',
          }}>
          <p style={{ fontSize: 11, color: todayWritten ? 'var(--teal-600)' : 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: 3 }}>
            {todayWritten ? '✅ Written today!' : `📅 ${dayjs().format('dddd, MMMM D')}`}
          </p>
          <p style={{ fontSize: 15, fontWeight: 800, color: todayWritten ? 'var(--teal-800)' : 'white', marginBottom: todayWritten ? 0 : 12, fontFamily: 'var(--font-main)' }}>
            {todayWritten ? 'You wrote today — keep the streak! 🔥' : "What happened today? Write in English ✏️"}
          </p>
          {!todayWritten && (
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px', textAlign: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>
              Start writing · +10 pt
            </div>
          )}
        </motion.div>

        {/* Featured diary */}
        {featuredDiary && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>This week's pick ☄️</p>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--amber-50)', color: 'var(--amber-800)', padding: '3px 9px', borderRadius: 20 }}>Comet's pick</span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>by {featuredDiary.nickname}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{featuredDiary.content}</p>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Leaderboard</p>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {leaderboard.map((u, i) => {
              const isMe = u.id === user?.uid;
              return (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: isMe ? 'var(--purple-50)' : 'transparent', borderBottom: i < leaderboard.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ width: 22, textAlign: 'center', fontSize: 16 }}>{MEDAL[i] || i + 1}</span>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: isMe ? 'var(--purple-200)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: isMe ? 'var(--purple-800)' : 'var(--text-secondary)', flexShrink: 0 }}>
                    {u.nickname?.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isMe ? 800 : 500, color: isMe ? 'var(--purple-800)' : 'var(--text-primary)' }}>
                    {u.nickname} {isMe && '(me)'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isMe ? 'var(--purple-600)' : 'var(--text-secondary)' }}>{(u.points || 0).toLocaleString()} pt</span>
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
