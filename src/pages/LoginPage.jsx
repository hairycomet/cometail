import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

  const checkInviteCode = async () => {
    if (!inviteCode.trim()) return;
    const code = inviteCode.trim().toUpperCase();

    // Check hardcoded codes first (works offline too)
    if (HARDCODED_CODES.includes(code)) {
      setInviteValid(true);
      setInviteData({ inviterNickname: 'Comet', inviterUid: 'admin', active: true });
      toast.success('Valid invite code! Welcome 🎉');
      return;
    }

    // Then try Firestore
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
    } catch (err) {
      console.error('Firestore error:', err);
      setInviteValid(false);
      toast.error('Invalid or expired code');
    }
  };

  const handleGoogleLogin = async () => {
    if (!inviteValid) {
      toast.error('Please enter a valid invite code first');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setUser({ ...user, isNew: true, inviteCode: inviteCode.toUpperCase(), inviteData });
      } else {
        const profile = userSnap.data();
        if (profile.approved === false) {
          toast.error('Your account is pending approval from Comet!');
          await auth.signOut();
          setLoading(false);
          return;
        }
        setUser(user);
        setUserProfile(profile);
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(83,74,183,0.1) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-8%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,159,39,0.08) 0%, transparent 70%)',
        }} />
        {floatingStars.map((s, i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', top: s.top, left: s.left, right: s.right, color: 'var(--purple-200)' }}
            animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IconStarFilled size={s.size} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '40px 36px',
          position: 'relative', zIndex: 1,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: 20,
              background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
              boxShadow: '0 8px 24px rgba(83,74,183,0.4)',
              marginBottom: 16,
            }}
          >
            <IconComet size={36} color="white" />
          </motion.div>
          <h1 style={{
            fontFamily: 'var(--font-main)', fontSize: 28, fontWeight: 900,
            color: 'var(--purple-800)', letterSpacing: '-0.5px', marginBottom: 6,
          }}>
            Cometail ☄️
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Your English journey starts here
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ marginBottom: 16 }}
        >
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 700,
            color: 'var(--text-secondary)', marginBottom: 8,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Invite Code
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={inviteCode}
              onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setInviteValid(null); }}
              onKeyDown={(e) => e.key === 'Enter' && checkInviteCode()}
              placeholder="e.g. COMET-HARRY"
              style={{
                flex: 1, padding: '11px 14px',
                border: `1.5px solid ${inviteValid === true ? 'var(--teal-400)' : inviteValid === false ? 'var(--red-400)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: 14, fontWeight: 600, letterSpacing: '0.05em',
                background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              onClick={checkInviteCode}
              style={{
                padding: '11px 16px',
                background: 'var(--bg-tertiary)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 13, fontWeight: 700,
                color: 'var(--text-secondary)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Check
            </button>
          </div>
          {inviteValid === true && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                marginTop: 8, padding: '8px 12px',
                background: 'var(--teal-50)', borderRadius: 'var(--radius-sm)',
                fontSize: 12, color: 'var(--teal-600)', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <IconSparkles size={14} /> Invited by {inviteData?.inviterNickname || 'Comet'} — Welcome!
            </motion.div>
          )}
          {inviteValid === false && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                marginTop: 8, padding: '8px 12px',
                background: 'var(--red-50)', borderRadius: 'var(--radius-sm)',
                fontSize: 12, color: 'var(--red-600)', fontWeight: 600,
              }}
            >
              Invalid or expired code. Ask Comet for a new one!
            </motion.div>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(83,74,183,0.2)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          disabled={loading || !inviteValid}
          style={{
            width: '100%', padding: '14px',
            background: inviteValid ? 'linear-gradient(135deg, var(--purple-600), var(--purple-800))' : 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 800,
            color: inviteValid ? 'white' : 'var(--text-tertiary)',
            transition: 'all 0.3s',
            cursor: inviteValid ? 'pointer' : 'not-allowed',
            marginBottom: 20, border: 'none',
          }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
            />
          ) : (
            <>
              <IconBrandGoogle size={20} />
              Continue with Google
            </>
          )}
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          By joining, you agree to write in English and have fun ☄️<br />
          <span style={{ color: 'var(--purple-400)', fontWeight: 600 }}>Cometail</span> is a private community by Comet (Harry)
        </p>
      </motion.div>
    </div>
  );
}
