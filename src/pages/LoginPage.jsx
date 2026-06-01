import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithCredential, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { useStore } from '../store';
import { IconBrandGoogle, IconComet, IconStarFilled, IconSparkles } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const HARDCODED_CODES = ['COMET-HARRY', 'COMETAIL', 'HARRY2024', 'WELCOME'];

// Detect environment
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isSafariBrowser = () => {
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|OPiOS/i.test(ua);
};

const floatingStars = [
  { top: '10%', left: '6%', size: 10, delay: 0 },
  { top: '18%', right: '8%', size: 7, delay: 0.5 },
  { top: '60%', left: '4%', size: 9, delay: 1 },
  { top: '72%', right: '6%', size: 12, delay: 0.3 },
  { top: '40%', right: '3%', size: 6, delay: 0.8 },
  { top: '82%', left: '10%', size: 8, delay: 1.2 },
];

export default function LoginPage() {
  const [checkingRedirect, setCheckingRedirect] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteValid, setInviteValid] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const setUser = useStore((s) => s.setUser);
  const setUserProfile = useStore((s) => s.setUserProfile);

  useEffect(() => {
    // Only check redirect result if we came back from a redirect
    const wasRedirecting = sessionStorage.getItem('cometail_redirecting');
    if (!wasRedirecting) return;

    sessionStorage.removeItem('cometail_redirecting');
    setCheckingRedirect(true);

    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await handleUserLogin(result.user);
        }
      })
      .catch((err) => {
        console.error('Redirect error:', err);
        toast.error('Login failed. Please try again.');
      })
      .finally(() => setCheckingRedirect(false));
  }, []);

  const handleUserLogin = async (firebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);
      const code = sessionStorage.getItem('cometail_invite') || inviteCode || 'COMET-HARRY';
      const data = JSON.parse(sessionStorage.getItem('cometail_invite_data') || '{"inviterNickname":"Comet","inviterUid":"admin"}');
      sessionStorage.removeItem('cometail_invite');
      sessionStorage.removeItem('cometail_invite_data');

      if (!snap.exists()) {
        setUser({ ...firebaseUser, isNew: true, inviteCode: code, inviteData: data });
      } else {
        setUser(firebaseUser);
        setUserProfile(snap.data());
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again!');
    }
  };

  const checkInviteCode = async () => {
    if (!inviteCode.trim()) return;
    const code = inviteCode.trim().toUpperCase();
    if (HARDCODED_CODES.includes(code)) {
      setInviteValid(true);
      setInviteData({ inviterNickname: 'Comet', inviterUid: 'admin', active: true });
      toast.success('Valid code! Welcome 🎉');
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'inviteCodes', code));
      if (snap.exists() && snap.data().active) {
        setInviteValid(true);
        setInviteData(snap.data());
        toast.success('Valid code! Welcome 🎉');
      } else {
        setInviteValid(false);
        toast.error('Invalid or expired code');
      }
    } catch {
      // If Firebase read fails, check hardcoded
      setInviteValid(false);
      toast.error('Invalid or expired code');
    }
  };

  const handleGoogleLogin = async () => {
    if (!inviteValid) { toast.error('Enter a valid invite code first'); return; }

    // Save invite info
    sessionStorage.setItem('cometail_invite', inviteCode.toUpperCase());
    sessionStorage.setItem('cometail_invite_data', JSON.stringify(inviteData || { inviterNickname: 'Comet', inviterUid: 'admin' }));

    setSigningIn(true);

    const useRedirect = isIOS() || isSafariBrowser();

    try {
      if (useRedirect) {
        sessionStorage.setItem('cometail_redirecting', '1');
        await signInWithRedirect(auth, googleProvider);
        // Will redirect away — no code runs after this
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        await handleUserLogin(result.user);
      }
    } catch (err) {
      console.error('Login error:', err);
      sessionStorage.removeItem('cometail_redirecting');

      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        // Fallback to redirect
        try {
          sessionStorage.setItem('cometail_redirecting', '1');
          await signInWithRedirect(auth, googleProvider);
        } catch (e2) {
          toast.error('Login failed. Please allow popups or try again.');
          setSigningIn(false);
        }
      } else {
        toast.error('Login failed: ' + (err.message || 'Unknown error'));
        setSigningIn(false);
      }
    }
  };

  if (checkingRedirect) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 8px 24px rgba(83,74,183,0.4)' }}>
          ☄️
        </motion.div>
        <div className="spinner" />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-main)', fontWeight: 600 }}>Signing you in...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
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
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420, background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: '36px 28px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }}
          style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 68, height: 68, borderRadius: 20, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', boxShadow: '0 8px 24px rgba(83,74,183,0.35)', marginBottom: 14 }}>
            <IconComet size={34} color="white" />
          </motion.div>
          <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 26, fontWeight: 900, color: 'var(--purple-800)', letterSpacing: '-0.5px', marginBottom: 5 }}>Cometail ☄️</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your English journey starts here</p>
        </motion.div>

        {/* Invite code */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Invite Code
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={inviteCode}
              onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setInviteValid(null); }}
              onKeyDown={(e) => e.key === 'Enter' && checkInviteCode()}
              placeholder="e.g. COMET-HARRY"
              style={{ flex: 1, padding: '12px 14px', border: `1.5px solid ${inviteValid === true ? 'var(--teal-400)' : inviteValid === false ? 'var(--red-400)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
            />
            <motion.button whileTap={{ scale: 0.94 }} onClick={checkInviteCode}
              style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Check
            </motion.button>
          </div>
          {inviteValid === true && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
        </div>

        {/* Google button */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={signingIn || !inviteValid}
          style={{
            width: '100%', padding: '14px', border: 'none',
            background: inviteValid ? 'linear-gradient(135deg, var(--purple-600), var(--purple-800))' : 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 800, color: inviteValid ? 'white' : 'var(--text-tertiary)',
            cursor: inviteValid && !signingIn ? 'pointer' : 'not-allowed', marginBottom: 18,
            boxShadow: inviteValid ? '0 4px 16px rgba(83,74,183,0.3)' : 'none',
          }}>
          {signingIn
            ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
            : <><IconBrandGoogle size={19} /> Continue with Google</>
          }
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          By joining, you agree to write English and have fun ☄️<br />
          <span style={{ color: 'var(--purple-400)', fontWeight: 700 }}>Cometail</span> is a private community by Comet (Harry)
        </p>
      </motion.div>
    </div>
  );
}
