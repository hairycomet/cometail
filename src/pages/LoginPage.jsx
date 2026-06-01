import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup, signInWithRedirect, getRedirectResult, OAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { useStore } from '../store';
import { IconBrandGoogle, IconComet, IconStarFilled, IconSparkles } from '@tabler/icons-react';
import toast from 'react-hot-toast';

const HARDCODED_CODES = ['COMET-HARRY', 'COMETAIL', 'HARRY2024', 'WELCOME'];

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const floatingStars = [
  { top: '10%', left: '6%', size: 10, delay: 0 },
  { top: '18%', right: '8%', size: 7, delay: 0.5 },
  { top: '60%', left: '4%', size: 9, delay: 1 },
  { top: '72%', right: '6%', size: 12, delay: 0.3 },
  { top: '40%', right: '3%', size: 6, delay: 0.8 },
  { top: '82%', left: '10%', size: 8, delay: 1.2 },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteValid, setInviteValid] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const setUser = useStore((s) => s.setUser);
  const setUserProfile = useStore((s) => s.setUserProfile);

  useEffect(() => {
    // Handle redirect result on page load (for iOS redirect flow)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await handleUserLogin(result.user);
        }
      })
      .catch((err) => {
        console.error('Redirect result error:', err);
        if (err.code !== 'auth/no-auth-event') {
          toast.error('Login failed. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUserLogin = async (firebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const code = localStorage.getItem('cometail_invite') || 'COMET-HARRY';
        const invData = JSON.parse(localStorage.getItem('cometail_invite_data') || '{"inviterNickname":"Comet","inviterUid":"admin"}');
        setUser({ ...firebaseUser, isNew: true, inviteCode: code, inviteData: invData });
      } else {
        const profile = userSnap.data();
        if (profile.approved === false) {
          toast.error('Your account is pending approval from Comet!');
          await auth.signOut();
          return;
        }
        setUser(firebaseUser);
        setUserProfile(profile);
      }
    } catch (err) {
      console.error('User login error:', err);
      toast.error('Something went wrong. Try again!');
    }
  };

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
    
    // Save invite info for after redirect
    localStorage.setItem('cometail_invite', inviteCode.toUpperCase());
    localStorage.setItem('cometail_invite_data', JSON.stringify(inviteData || { inviterNickname: 'Comet', inviterUid: 'admin' }));
    
    setSigningIn(true);
    try {
      // iOS Safari needs redirect, others work with popup
      if (isIOS() || isSafari()) {
        await signInWithRedirect(auth, googleProvider);
        // Page will reload — result handled in useEffect
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        await handleUserLogin(result.user);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-blocked') {
        // Fallback to redirect
        await signInWithRedirect(auth, googleProvider);
      } else if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Login failed: ' + (err.message || 'Unknown error'));
      }
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>☄️</div>
        <div className="spinner" />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-main)' }}>Loading Cometail...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(83,74,183,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,159,39,0.08) 0%, transparent 70%)' }} />
        {floatingStars.map((s, i) => (
          <motion.div key={i} style={{ position: 'absolute', top: s.top, left: s.left, right: s.right, color: 'var(--purple-200)' }}
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i * 0.3, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}>
            <IconStarFilled size={s.size} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 420, background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: '36px 28px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 68, height: 68, borderRadius: 20, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', boxShadow: '0 8px 24px rgba(83,74,183,0.35)', marginBottom: 14 }}>
            <IconComet size={34} color="white" />
          </motion.div>
          <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 26, fontWeight: 900, color: 'var(--purple-800)', letterSpacing: '-0.5px', marginBottom: 5 }}>Cometail ☄️</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your English journey starts here</p>
        </motion.div>

        {/* Invite code */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Invite Code
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={inviteCode}
              onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setInviteValid(null); }}
              onKeyDown={(e) => e.key === 'Enter' && checkInviteCode()}
              placeholder="e.g. COMET-HARRY"
              style={{
                flex: 1, padding: '12px 14px',
                border: `1.5px solid ${inviteValid === true ? 'var(--teal-400)' : inviteValid === false ? 'var(--red-400)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 700,
                letterSpacing: '0.05em', background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                transition: 'border-color 0.2s',
              }}
            />
            <motion.button whileTap={{ scale: 0.94 }} onClick={checkInviteCode}
              style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Check
            </motion.button>
          </div>

          {inviteValid === true && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: 8, padding: '8px 12px', background: 'var(--teal-50)', borderRadius: 10, fontSize: 12, color: 'var(--teal-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconSparkles size={14} /> Invited by {inviteData?.inviterNickname || 'Comet'} — Welcome!
            </motion.div>
          )}
          {inviteValid === false && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: 8, padding: '8px 12px', background: 'var(--red-50)', borderRadius: 10, fontSize: 12, color: 'var(--red-600)', fontWeight: 700 }}>
              Invalid code. Ask Comet for a new one!
            </motion.div>
          )}
        </motion.div>

        {/* Google button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={signingIn || !inviteValid}
          style={{
            width: '100%', padding: '14px',
            background: inviteValid ? 'linear-gradient(135deg, var(--purple-600), var(--purple-800))' : 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 800,
            color: inviteValid ? 'white' : 'var(--text-tertiary)',
            cursor: inviteValid ? 'pointer' : 'not-allowed',
            marginBottom: 18, border: 'none',
            boxShadow: inviteValid ? '0 4px 16px rgba(83,74,183,0.3)' : 'none',
            transition: 'all 0.2s',
          }}>
          {signingIn ? (
            <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
          ) : (
            <><IconBrandGoogle size={19} /> Continue with Google</>
          )}
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          By joining, you agree to write in English and have fun ☄️<br />
          <span style={{ color: 'var(--purple-400)', fontWeight: 700 }}>Cometail</span> is a private community by Comet (Harry)
        </p>
      </motion.div>
    </div>
  );
}
