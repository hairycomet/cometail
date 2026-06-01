import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import { IconArrowLeft, IconStar, IconFlame, IconBulb, IconCheck } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const PROMPTS = [
  "What happened today? It can be big or small.",
  "What is something you learned today?",
  "Describe someone you talked to today.",
  "What made you smile today?",
  "What was the most interesting part of your day?",
  "What are you looking forward to tomorrow?",
  "Describe what you ate today and how it tasted.",
  "What song or show did you enjoy recently?",
];

export default function DiaryNewPage() {
  const navigate = useNavigate();
  const { user, userProfile, setUserProfile } = useStore();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const today = dayjs().format('YYYY-MM-DD');
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const minWords = userProfile?.minWords || 30;
  const progress = Math.min((wordCount / minWords) * 100, 100);

  useEffect(() => {
    // Check if already written today
    if (!user) return;
    const checkToday = async () => {
      const q = query(collection(db, 'diaries'), where('uid', '==', user.uid), where('date', '==', today));
      const snap = await getDocs(q);
      if (!snap.empty) setSubmitted(true);
    };
    checkToday();
  }, []);

  const handleSubmit = async () => {
    if (wordCount < 10) { toast.error('Write at least 10 words!'); return; }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'diaries'), {
        uid: user.uid,
        nickname: userProfile?.nickname || 'Anonymous',
        content,
        date: today,
        wordCount,
        featured: false,
        createdAt: serverTimestamp(),
      });

      // Update user points and streak
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        points: increment(10),
        totalDiaries: increment(1),
        lastActiveAt: serverTimestamp(),
      });

      setSubmitted(true);
      setUserProfile({ ...userProfile, points: (userProfile?.points || 0) + 10, totalDiaries: (userProfile?.totalDiaries || 0) + 1 });
      toast.success('+10 pt earned! Great job! 🎉');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit. Try again!');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconArrowLeft size={18} color="var(--text-secondary)" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>Today's diary</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{dayjs().format('dddd, MMMM D, YYYY')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--purple-50)', padding: '5px 10px', borderRadius: 20 }}>
          <IconStar size={14} color="var(--purple-600)" />
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--purple-600)' }}>+10 pt</span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', padding: 32, textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-main)', fontSize: 22, fontWeight: 900, color: 'var(--purple-800)', marginBottom: 8 }}>Already written today!</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Come back tomorrow to keep your streak going 🔥</p>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/home')}
              style={{ background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
              Go home
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Prompt */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'linear-gradient(135deg, var(--purple-50), var(--purple-100))', borderRadius: 'var(--radius-lg)', padding: '14px 16px', marginBottom: 12, border: '1.5px solid var(--purple-200)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <IconBulb size={18} color="var(--purple-600)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple-400)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's prompt</p>
                <p style={{ fontSize: 14, color: 'var(--purple-900)', fontWeight: 500, lineHeight: 1.5 }}>{prompt}</p>
              </div>
            </motion.div>

            {/* Writing area */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border)', overflow: 'hidden', marginBottom: 12 }}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing in English...&#10;&#10;Today I..."
                style={{
                  width: '100%', minHeight: 220, padding: '16px', fontSize: 15,
                  fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
                  background: 'transparent', border: 'none', resize: 'none', outline: 'none',
                  lineHeight: 1.8,
                }}
              />
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: wordCount >= minWords ? 'var(--teal-600)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                  {wordCount} words {wordCount >= minWords ? '✓ Goal reached!' : `(goal: ${minWords})`}
                </span>
                <div style={{ width: 80, height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: wordCount >= minWords ? 'var(--teal-400)' : 'var(--purple-400)', borderRadius: 2 }} />
                </div>
              </div>
            </motion.div>

            {/* Streak info */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 16, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconFlame size={18} color="#E24B4A" />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>
                Current streak: <strong style={{ color: 'var(--text-primary)' }}>{userProfile?.streak || 0} days</strong>
              </span>
              <span style={{ fontSize: 12, color: 'var(--purple-600)', fontWeight: 700 }}>+10 pt on submit</span>
            </motion.div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting || wordCount < 10}
              style={{
                width: '100%', padding: '15px',
                background: wordCount >= 10 ? 'linear-gradient(135deg, var(--purple-600), var(--purple-800))' : 'var(--bg-tertiary)',
                color: wordCount >= 10 ? 'white' : 'var(--text-tertiary)',
                border: 'none', borderRadius: 'var(--radius-lg)',
                fontSize: 15, fontWeight: 800, cursor: wordCount >= 10 ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'var(--font-main)',
              }}>
              {submitting ? '...' : <><IconCheck size={18} /> Submit diary · +10 pt</>}
            </motion.button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
