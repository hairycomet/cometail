import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import { IconArrowLeft, IconKeyboard, IconBolt, IconTarget, IconTrophy, IconRefresh } from '@tabler/icons-react';
import toast from 'react-hot-toast';

const FREE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the alphabet.",
  "Learning English every day is the best way to improve your skills. Practice makes perfect!",
  "Reading books, watching movies, and writing diaries will help you become fluent in English.",
  "Every expert was once a beginner. Keep practicing and you will see amazing progress.",
];

export default function TypingPage() {
  const navigate = useNavigate();
  const { user, userProfile, setUserProfile } = useStore();
  const [mode, setMode] = useState('free'); // 'free' | 'template'
  const [text, setText] = useState(FREE_TEXTS[0]);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  const handleInput = (val) => {
    if (!started && val.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(val);

    // Calculate stats
    if (startTime) {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const words = val.trim().split(/\s+/).length;
      setWpm(Math.round(words / Math.max(elapsed, 0.01)));
    }

    // Accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
    }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);

    // Check if done
    if (val === text) {
      handleFinish(val);
    }
  };

  const handleFinish = async (val) => {
    setFinished(true);
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const words = val.trim().split(/\s+/).length;
    const finalWpm = Math.round(words / Math.max(elapsed, 0.01));
    setWpm(finalWpm);

    if (finalWpm > (userProfile?.typingBest || 0)) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { typingBest: finalWpm });
        setUserProfile({ ...userProfile, typingBest: finalWpm });
        toast.success(`New personal best! ${finalWpm} wpm 🎉`);
      } catch (e) { console.error(e); }
    }
  };

  const reset = () => {
    setInput('');
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setText(FREE_TEXTS[Math.floor(Math.random() * FREE_TEXTS.length)]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const getCharColor = (i) => {
    if (i >= input.length) return 'var(--text-tertiary)';
    return input[i] === text[i] ? 'var(--text-primary)' : 'var(--red-400)';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-main)' }}>Typing Practice</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Best: {userProfile?.typingBest || 0} wpm</p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[{ id: 'free', label: '⌨️ Free typing' }, { id: 'template', label: '📚 Templates' }].map((m) => (
            <motion.button key={m.id} whileTap={{ scale: 0.95 }}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                background: mode === m.id ? 'var(--purple-600)' : 'var(--bg-primary)',
                color: mode === m.id ? 'white' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: 13,
                border: mode === m.id ? 'none' : '1px solid var(--border)',
              }}>
              {m.label}
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconBolt size={20} color="var(--amber-600)" />
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{wpm}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>WPM</div>
            </div>
          </div>
          <div className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconTarget size={20} color="var(--teal-600)" />
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{accuracy}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Accuracy</div>
            </div>
          </div>
        </div>

        {/* Typing area */}
        {!finished ? (
          <>
            <div className="card" style={{ padding: 16, marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Type this text</p>
              <p style={{ fontSize: 16, lineHeight: 2, letterSpacing: '0.02em', userSelect: 'none' }}>
                {text.split('').map((char, i) => (
                  <span key={i} style={{
                    color: getCharColor(i),
                    background: i === input.length ? 'var(--purple-100)' : 'transparent',
                    borderRadius: 2, transition: 'color 0.1s',
                  }}>
                    {char}
                  </span>
                ))}
              </p>
            </div>

            <div className="card" style={{ marginBottom: 12 }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="Start typing here..."
                style={{
                  width: '100%', padding: '16px', minHeight: 100,
                  fontSize: 15, fontFamily: 'var(--font-body)',
                  color: 'var(--text-primary)', background: 'transparent',
                  border: 'none', resize: 'none', outline: 'none', lineHeight: 1.7,
                }}
              />
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${(input.length / text.length) * 100}%` }}
                style={{ height: '100%', background: 'var(--purple-600)', borderRadius: 2 }}
              />
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card" style={{ padding: 24, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-main)', fontSize: 22, fontWeight: 900, color: 'var(--purple-800)', marginBottom: 8 }}>
              {wpm} WPM · {accuracy}% accuracy
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {wpm >= (userProfile?.typingBest || 0) ? 'New personal best! 🏆' : `Best: ${userProfile?.typingBest || 0} wpm`}
            </p>
            <motion.button whileTap={{ scale: 0.97 }} onClick={reset}
              className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IconRefresh size={18} /> Try again
            </motion.button>
          </motion.div>
        )}

        {!finished && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={reset}
            style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <IconRefresh size={16} /> New text
          </motion.button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
