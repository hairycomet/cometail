import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import MiniMe from '../components/MiniMe';
import { IconStar, IconTrophy, IconNotebook, IconKeyboard, IconFlame, IconSettings, IconMoon, IconSun, IconShoppingBag, IconLogout, IconCopy } from '@tabler/icons-react';
import toast from 'react-hot-toast';

const BADGES = [
  { id: 'first_join', icon: '🌟', name: 'First Join', desc: 'Joined Cometail' },
  { id: 'first_diary', icon: '📓', name: 'First Diary', desc: 'Wrote first diary' },
  { id: 'streak_7', icon: '🔥', name: '7-Day Streak', desc: '7 days in a row' },
  { id: 'streak_30', icon: '💫', name: '30-Day Streak', desc: '30 days in a row' },
  { id: 'wpm_50', icon: '⌨️', name: '50 WPM Club', desc: 'Reached 50 wpm' },
  { id: 'wpm_80', icon: '⚡', name: 'Speed Demon', desc: 'Reached 80 wpm' },
];

const LEVEL_NAMES = { 1: 'Beginner', 2: 'Beginner', 3: 'Writer', 4: 'Writer', 5: 'Storyteller', 6: 'Storyteller', 7: 'Author', 8: 'Author', 9: 'Legend', 10: 'Legend' };

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userProfile, theme, toggleTheme, setUser, setUserProfile } = useStore();
  const lv = userProfile?.level || 1;
  const xp = userProfile?.xp || 0;
  const xpNeeded = lv * 1000;
  const xpProgress = Math.min((xp % xpNeeded) / xpNeeded * 100, 100);
  const earnedBadges = userProfile?.badges || [];

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    navigate('/login');
  };

  const copyInviteCode = () => {
    const code = userProfile?.myInviteCode || 'COMET-HARRY';
    navigator.clipboard?.writeText(code).then(() => toast.success('Invite code copied!'));
  };

  const stats = [
    { icon: IconStar, label: 'Points', value: (userProfile?.points || 0).toLocaleString(), color: 'var(--amber-600)' },
    { icon: IconTrophy, label: 'Rank', value: '#1', color: 'var(--purple-600)' },
    { icon: IconNotebook, label: 'Diaries', value: userProfile?.totalDiaries || 0, color: 'var(--teal-600)' },
    { icon: IconKeyboard, label: 'Best wpm', value: userProfile?.typingBest || 0, color: 'var(--purple-400)' },
  ];

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-main)' }}>My Profile</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'light' ? <IconMoon size={17} color="var(--text-secondary)" /> : <IconSun size={17} color="var(--text-secondary)" />}
          </motion.button>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Character + info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, var(--purple-50), var(--purple-100))', borderRadius: 'var(--radius-xl)', padding: 16, marginBottom: 12, border: '1.5px solid var(--purple-200)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <MiniMe equipped={userProfile?.equipped || {}} size={80} />
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/shop')}
              style={{ fontSize: 10, fontWeight: 700, color: 'var(--purple-600)', background: 'var(--purple-50)', border: '1px solid var(--purple-200)', borderRadius: 20, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconShoppingBag size={11} /> Shop
            </motion.button>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--purple-900)', fontFamily: 'var(--font-main)', marginBottom: 2 }}>{userProfile?.nickname}</h2>
            <p style={{ fontSize: 12, color: 'var(--purple-400)', marginBottom: 10 }}>Lv {lv} · {LEVEL_NAMES[lv]}</p>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--purple-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>XP Progress</span>
                <span style={{ fontSize: 11, color: 'var(--purple-600)', fontWeight: 700 }}>{xp % xpNeeded} / {xpNeeded}</span>
              </div>
              <div style={{ height: 6, background: 'var(--purple-200)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--purple-600)', borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconFlame size={15} color="#E24B4A" />
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--purple-900)' }}>{userProfile?.streak || 0}-day streak</span>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Badges</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {BADGES.map((badge) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <div key={badge.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: earned ? 'var(--purple-50)' : 'var(--bg-secondary)', borderRadius: 12, border: `1px solid ${earned ? 'var(--purple-200)' : 'var(--border)'}`, opacity: earned ? 1 : 0.4 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{badge.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: earned ? 'var(--purple-800)' : 'var(--text-secondary)' }}>{badge.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{badge.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invite code */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Your invite code</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px' }}>
              <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.08em', color: 'var(--purple-800)', fontFamily: 'var(--font-main)' }}>
                {userProfile?.myInviteCode || 'COMET-HARRY'}
              </span>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={copyInviteCode}
              style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--purple-50)', border: '1px solid var(--purple-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCopy size={18} color="var(--purple-600)" />
            </motion.button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>{userProfile?.invitesLeft || 1} invite(s) remaining</p>
        </div>

        {/* Logout */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogout}
          style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--red-50)', color: 'var(--red-600)', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid rgba(226,75,74,0.2)' }}>
          <IconLogout size={18} /> Sign out
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
