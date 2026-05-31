import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import { IconChevronRight, IconCheck, IconComet, IconSparkles } from '@tabler/icons-react';
import toast from 'react-hot-toast';

const EXAM_OPTIONS = [
  { id: 'toeic', icon: '📝', name: 'TOEIC', sub: 'Business English' },
  { id: 'toefl', icon: '🎓', name: 'TOEFL', sub: 'Academic English' },
  { id: 'ielts', icon: '🌍', name: 'IELTS', sub: 'International' },
  { id: 'conversation', icon: '💬', name: 'Conversation', sub: 'Everyday English' },
  { id: 'csat', icon: '🏫', name: '수능', sub: 'Korean CSAT' },
  { id: 'other', icon: '✨', name: 'Other', sub: 'Comet will set up' },
];

const STEPS = ['Profile', 'Goal', 'Done'];

export default function OnboardingPage() {
  const { user, setUserProfile } = useStore();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [realName, setRealName] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!nickname.trim()) { toast.error('Please enter a nickname'); return; }
    setLoading(true);
    try {
      const profile = {
        uid: user.uid,
        email: user.email,
        nickname: nickname.trim(),
        realName: realName.trim(),
        examType: selectedExam || 'other',
        photoURL: user.photoURL,
        points: 50,
        level: 1,
        streak: 0,
        streakLastDate: null,
        totalDiaries: 0,
        typingBest: 0,
        badges: ['first_join'],
        inviteCode: user.inviteCode || null,
        invitedBy: user.inviteData?.inviterUid || null,
        invitesLeft: 1,
        uiLanguage: 'ko',
        approved: true,
        role: 'student',
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', user.uid), profile);

      // Give referral bonus to inviter
      if (user.inviteData?.inviterUid) {
        // Will be handled by cloud function or next login
      }

      setUserProfile(profile);
      toast.success('Welcome to Cometail! +50 pt earned 🎉');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const variants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i <= step ? 'var(--purple-600)' : 'var(--bg-tertiary)',
                border: `2px solid ${i <= step ? 'var(--purple-600)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
                color: i <= step ? 'white' : 'var(--text-tertiary)',
                transition: 'all 0.3s',
              }}>
                {i < step ? <IconCheck size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: i === step ? 'var(--purple-600)' : 'var(--text-tertiary)' }}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{ width: 24, height: 2, background: i < step ? 'var(--purple-600)' : 'var(--border)', borderRadius: 2, transition: 'all 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
          padding: '36px 32px', overflow: 'hidden', position: 'relative',
        }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, color: 'var(--purple-800)' }}>
                  Create your identity ✏️
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
                  Your nickname is visible to everyone. Your real name is only visible to Comet.
                </p>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Nickname (public)
                  </label>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. StarWriter, MoonRider..."
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 14, background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Real name (Comet only)
                  </label>
                  <input
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="홍길동"
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 14, background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { if (nickname.trim()) setStep(1); else toast.error('Enter a nickname!'); }}
                  style={{
                    width: '100%', padding: 14,
                    background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
                    borderRadius: 'var(--radius-md)', color: 'white',
                    fontSize: 15, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  Next <IconChevronRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, color: 'var(--purple-800)' }}>
                  What's your goal? 🎯
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  We'll assign the right templates for you.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
                  {EXAM_OPTIONS.map((ex) => (
                    <motion.div
                      key={ex.id}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedExam(ex.id)}
                      style={{
                        border: `2px solid ${selectedExam === ex.id ? 'var(--purple-600)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)', padding: '14px 12px',
                        cursor: 'pointer', textAlign: 'center',
                        background: selectedExam === ex.id ? 'var(--purple-50)' : 'var(--bg-secondary)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{ex.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: selectedExam === ex.id ? 'var(--purple-800)' : 'var(--text-primary)', marginBottom: 2 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{ex.sub}</div>
                    </motion.div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setStep(0)}
                    style={{ flex: 1, padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    style={{
                      flex: 2, padding: 14,
                      background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
                      borderRadius: 'var(--radius-md)', color: 'white',
                      fontSize: 15, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    Next <IconChevronRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ fontSize: 56, marginBottom: 16 }}
                  >
                    🎉
                  </motion.div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--purple-800)', marginBottom: 8 }}>
                    Welcome, {nickname}!
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    You're now part of Cometail. Start your first diary to earn points!
                  </p>
                </div>

                <div style={{
                  background: 'var(--green-50)', borderRadius: 'var(--radius-md)',
                  padding: '12px 16px', marginBottom: 24,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <IconSparkles size={20} color="var(--green-600)" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-600)' }}>
                    +50 pt earned for joining!
                  </span>
                </div>

                <div style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 24 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                    First missions
                  </p>
                  {[
                    { icon: '📓', text: 'Write your first diary', pts: '+10 pt' },
                    { icon: '⌨️', text: 'Try typing practice', pts: '+5 pt' },
                    { icon: '👋', text: 'Invite a friend', pts: '+50 pt' },
                  ].map((m) => (
                    <div key={m.text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                      <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{m.text}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--purple-600)' }}>{m.pts}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleFinish}
                  disabled={loading}
                  style={{
                    width: '100%', padding: 14,
                    background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
                    borderRadius: 'var(--radius-md)', color: 'white',
                    fontSize: 15, fontWeight: 800,
                  }}
                >
                  {loading ? 'Setting up...' : 'Go to my home! ☄️'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
