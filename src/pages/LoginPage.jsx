import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { useStore } from '../store';
import { IconBrandGoogle, IconComet, IconStarFilled, IconSparkles } from '@tabler/icons-react';
import toast from 'react-hot-toast';

const HARDCODED_CODES = ['COMET-HARRY', 'COMETAIL', 'HARRY2024', 'WELCOME'];

const floatingStars = [
  { top: '12%', left: '8%', size: 12, delay: 0 },
  { top: '20%', right: '10%', size: 8, delay: 0.5 },
  { top: '55%', left: '5%', size: 10, delay: 1 },
  { top: '70%', right: '8%', size: 14, delay: 0.3 },
  { top: '35%', right: '4%', size: 7, delay: 0.8 },
  { top: '80%', left: '12%', size: 9, delay: 1.2 },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteValid, setInviteValid] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const setUser = useStore((s) => s.setUser);
  const setUserProfile = useStore((s) => s.setUserProfile);

  useEffect(() => {
    setLoading(true);
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          setUser({ ...user, isNew: true, inviteCode: 'COMET-HARRY', inviteData: { inviterNickname: 'Comet', inviterUid: 'admin' } });
        } else {
          setUser(user);
          setUserProfile(userSnap.data());
        }
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Redirect result error:', err);
      setLoading(false);
    });
  }, []);

  const checkInviteCode = async () => {
    if (!inviteCode.trim()) return;
    const code = inviteCode.trim().toUpperCase();
    if (HARDCODED_CODES.includes(code)) {
      setInviteValid(true);
      setInviteData({ inviterNickname: 'Comet', inviterUid: 'admin', active: true });
      toast.success('Valid invite code! Welcome 🎉');
      return;
    }
    try {
      const ref = doc(db, 'inviteCodes', code);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().active === true) {
        setInviteValid(true);
        setInviteData(snap.data());
        toast.success('Valid invite code! Welcome 🎉');
      } else {
        setInviteValid(false);
        toast.error('Invalid or expired code');
      }
    } catch {
      setInviteValid(false);
      toast.error('Invalid or expired code');
    }
  };

  const handleGoogleLogin = async () => {
    if (!inviteValid) { toast.error('Please enter a valid invite code first'); return; }
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 40, height: 40, border: '3px solid var(--purple-200)', borderTopColor: 'var(--purple-600)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(83,74,183,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,159,39,0.08) 0%, transparent 70%)' }} />
        {floatingStars.map((s, i) => (
          <motion.div key={i} style={{ position: 'absolute', top: s.top, left: s.left, right: s.right, color: 'var(--purple-200)' }}
            animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}>
            <IconStarFilled size={s.size} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 420, background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: '40px 36px', position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', boxShadow: '0 8px 24px rgba(83,74,183,0.4)', marginBottom: 16 }}>
            <IconComet size={36} color="white" />
          </motion.div>
          <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 28, fontWeight: 900, color: 'var(--purple-800)', letterSpacing: '-0.5px', marginBottom: 6 }}>Cometail ☄️</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Your English journey starts here</p>
        </motion.div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Invite Code</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={inviteCode} onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setInviteValid(null); }}
              onKeyDown={(e) => e.key === 'Enter' && checkInviteCode()} placeholder="e.g. COMET-HARRY"
              style={{ flex: 1, padding: '11px 14px', border: `1.5px solid ${inviteValid === true ? 'var(--teal-400)' : inviteValid === false ? 'var(--red-400)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
            <button onClick={checkInviteCode} style={{ padding: '11px 16px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer' }}>Check</button>
          </div>
          {inviteValid === true && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: 8, padding: '8px 12px', background: 'var(--teal-50)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--teal-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconSparkles size={14} /> Invited by {inviteData?.inviterNickname || 'Comet'} — Welcome!
            </motion.div>
          )}
          {inviteValid === false && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: 8, padding: '8px 12px', background: 'var(--red-50)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--red-600)', fontWeight: 600 }}>
              Invalid or expired code. Ask Comet for a new one!
            </motion.div>
          )}
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleLogin} disabled={!inviteValid}
          style={{ width: '100%', padding: '14px', background: inviteValid ? 'linear-gradient(135deg, var(--purple-600), var(--purple-800))' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 15, fontWeight: 800, color: inviteValid ? 'white' : 'var(--text-tertiary)', cursor: inviteValid ? 'pointer' : 'not-allowed', marginBottom: 20, border: 'none' }}>
          <IconBrandGoogle size={20} />
          Continue with Google
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          By joining, you agree to write in English and have fun ☄️<br />
          <span style={{ color: 'var(--purple-400)', fontWeight: 600 }}>Cometail</span> is a private community by Comet (Harry)
        </p>
      </motion.div>
    </div>
  );
}
