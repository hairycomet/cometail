import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useStore } from '../store';
import { IconComet, IconStarFilled, IconMail, IconLock, IconEye, IconEyeOff, IconSparkles, IconUser } from '@tabler/icons-react';
import toast from 'react-hot-toast';

const HARDCODED_CODES = ['COMET-HARRY', 'COMETAIL', 'HARRY2024', 'WELCOME'];

const floatingStars = [
  { top: '10%', left: '6%', size: 10, delay: 0 },
  { top: '18%', right: '8%', size: 7, delay: 0.5 },
  { top: '60%', left: '4%', size: 9, delay: 1 },
  { top: '72%', right: '6%', size: 12, delay: 0.3 },
  { top: '40%', right: '3%', size: 6, delay: 0.8 },
  { top: '82%', left: '10%', size: 8, delay: 1.2 },
];

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteValid, setInviteValid] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser, setUserProfile } = useStore();

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
      setInviteValid(false);
      toast.error('Invalid or expired code');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const snap = await getDoc(doc(db, 'users', result.user.uid));
      if (snap.exists()) {
        setUser(result.user);
        setUserProfile(snap.data());
      } else {
        setUser({ ...result.user, isNew: true, inviteCode: 'COMET-HARRY', inviteData: { inviterNickname: 'Comet', inviterUid: 'admin' } });
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        toast.error('Wrong email or password');
      } else if (err.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Try again later.');
      } else {
        toast.error('Login failed. Try again.');
      }
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!inviteValid) { toast.error('Enter a valid invite code first'); return; }
    if (!email) { toast.error('Enter your email'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      setUser({
        ...result.user,
        isNew: true,
        inviteCode: inviteCode.toUpperCase(),
        inviteData: inviteData || { inviterNickname: 'Comet', inviterUid: 'admin' },
      });
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Email already registered. Try logging in!');
        setMode('login');
      } else if (err.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Signup failed. Try again.');
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '13px 14px 13px 42px',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
    fontSize: 15, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
    outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-body)',
  };

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
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', boxShadow: '0 8px 24px rgba(83,74,183,0.35)', marginBottom: 12 }}>
            <IconComet size={32} color="white" />
          </motion.div>
          <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 24, fontWeight: 900, color: 'var(--purple-800)', marginBottom: 4 }}>Cometail ☄️</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your English journey starts here</p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 12, padding: 4, marginBottom: 20, gap: 4 }}>
          {[{ id: 'login', label: 'Sign in' }, { id: 'signup', label: 'Join' }].map((m) => (
            <motion.button key={m.id} whileTap={{ scale: 0.95 }} onClick={() => setMode(m.id)}
              style={{ flex: 1, padding: '9px', borderRadius: 9, background: mode === m.id ? 'var(--bg-primary)' : 'transparent', color: mode === m.id ? 'var(--purple-600)' : 'var(--text-tertiary)', fontWeight: mode === m.id ? 800 : 500, fontSize: 14, boxShadow: mode === m.id ? 'var(--shadow-sm)' : 'none', fontFamily: 'var(--font-main)', border: 'none', cursor: 'pointer' }}>
              {m.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* Invite code (signup only) */}
            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Invite Code</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <IconSparkles size={16} color="var(--purple-400)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={inviteCode} onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setInviteValid(null); }}
                      onKeyDown={(e) => e.key === 'Enter' && checkInviteCode()}
                      placeholder="e.g. COMET-HARRY"
                      style={{ ...inputStyle, border: `1.5px solid ${inviteValid === true ? 'var(--teal-400)' : inviteValid === false ? 'var(--red-400)' : 'var(--border)'}`, fontWeight: 700, letterSpacing: '0.04em' }} />
                  </div>
                  <motion.button whileTap={{ scale: 0.93 }} onClick={checkInviteCode}
                    style={{ padding: '13px 16px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-main)' }}>
                    Check
                  </motion.button>
                </div>
                {inviteValid === true && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ marginTop: 7, padding: '7px 12px', background: 'var(--teal-50)', borderRadius: 9, fontSize: 12, color: 'var(--teal-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IconSparkles size={13} /> Invited by {inviteData?.inviterNickname || 'Comet'} — Welcome!
                  </motion.div>
                )}
                {inviteValid === false && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ marginTop: 7, padding: '7px 12px', background: 'var(--red-50)', borderRadius: 9, fontSize: 12, color: 'var(--red-600)', fontWeight: 700 }}>
                    Invalid code. Ask Comet for a new one!
                  </motion.div>
                )}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <IconMail size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())}
                  placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--purple-400)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <IconLock size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--purple-400)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  {showPw ? <IconEyeOff size={17} color="var(--text-tertiary)" /> : <IconEye size={17} color="var(--text-tertiary)" />}
                </motion.button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={mode === 'login' ? handleLogin : handleSignup}
              disabled={loading || (mode === 'signup' && !inviteValid)}
              style={{
                width: '100%', padding: '14px', border: 'none',
                background: (mode === 'signup' && !inviteValid) ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
                borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 15, fontWeight: 800, color: (mode === 'signup' && !inviteValid) ? 'var(--text-tertiary)' : 'white',
                cursor: loading || (mode === 'signup' && !inviteValid) ? 'not-allowed' : 'pointer',
                marginBottom: 16, boxShadow: '0 4px 16px rgba(83,74,183,0.25)',
                fontFamily: 'var(--font-main)',
              }}>
              {loading
                ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : mode === 'login' ? 'Sign in' : 'Create account'
              }
            </motion.button>

          </motion.div>
        </AnimatePresence>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          {mode === 'login'
            ? <>New here? <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMode('signup')} style={{ color: 'var(--purple-500)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11 }}>Get an invite code from Comet →</motion.button></>
            : <>Already have an account? <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMode('login')} style={{ color: 'var(--purple-500)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11 }}>Sign in →</motion.button></>
          }
        </p>
      </motion.div>
    </div>
  );
}
