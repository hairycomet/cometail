import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import { IconChecklist, IconClock, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function HomeworkPage() {
  const { user, userProfile } = useStore();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [answerText, setAnswerText] = useState({});

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'homework'),
          where('assignedTo', 'array-contains', user.uid),
          orderBy('dueDate', 'asc')
        );
        const snap = await getDocs(q);
        setHomework(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        // If no homework yet, show empty state
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSubmit = async (hwId) => {
    const text = answerText[hwId];
    if (!text?.trim()) { toast.error('Write your answer first!'); return; }
    setSubmitting(hwId);
    try {
      await updateDoc(doc(db, 'homework', hwId), {
        [`submissions.${user.uid}`]: {
          content: text,
          submittedAt: serverTimestamp(),
          uid: user.uid,
          nickname: userProfile?.nickname,
        }
      });
      setHomework(prev => prev.map(h => h.id === hwId ? { ...h, submissions: { ...h.submissions, [user.uid]: { content: text } } } : h));
      toast.success('Submitted! +15 pt 🎉');
    } catch (e) {
      console.error(e);
      toast.error('Failed to submit');
    }
    setSubmitting(null);
  };

  const isSubmitted = (hw) => hw.submissions && hw.submissions[user?.uid];
  const isOverdue = (hw) => dayjs(hw.dueDate?.toDate?.() || hw.dueDate).isBefore(dayjs());

  const pending = homework.filter(h => !isSubmitted(h));
  const done = homework.filter(h => isSubmitted(h));

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-main)' }}>Homework</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          {pending.length} pending · {done.length} completed
        </p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : homework.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>No homework yet!</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Comet will assign tasks here.</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Pending</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {pending.map((hw, i) => (
                    <motion.div key={hw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="card" style={{ padding: 16, border: isOverdue(hw) ? '1.5px solid var(--red-400)' : '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: isOverdue(hw) ? 'var(--red-50)' : 'var(--purple-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isOverdue(hw) ? <IconAlertCircle size={18} color="var(--red-600)" /> : <IconChecklist size={18} color="var(--purple-600)" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-main)', marginBottom: 3 }}>{hw.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>{hw.description}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <IconClock size={12} color={isOverdue(hw) ? 'var(--red-400)' : 'var(--text-tertiary)'} />
                            <span style={{ fontSize: 11, color: isOverdue(hw) ? 'var(--red-600)' : 'var(--text-tertiary)', fontWeight: isOverdue(hw) ? 700 : 400 }}>
                              {isOverdue(hw) ? 'Overdue · ' : 'Due · '}{dayjs(hw.dueDate?.toDate?.() || hw.dueDate).format('MMM D')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {hw.cometNote && (
                        <div style={{ padding: '10px 12px', background: 'var(--purple-50)', borderRadius: 10, marginBottom: 12, fontSize: 13, color: 'var(--purple-800)', display: 'flex', gap: 6 }}>
                          <span>☄️</span><span>{hw.cometNote}</span>
                        </div>
                      )}
                      <textarea
                        value={answerText[hw.id] || ''}
                        onChange={(e) => setAnswerText(prev => ({ ...prev, [hw.id]: e.target.value }))}
                        placeholder="Write your answer in English..."
                        style={{ width: '100%', minHeight: 80, padding: '12px', fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, resize: 'none', outline: 'none', marginBottom: 10, lineHeight: 1.6 }}
                      />
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleSubmit(hw.id)} disabled={submitting === hw.id}
                        className="btn-primary" style={{ fontSize: 13 }}>
                        {submitting === hw.id ? 'Submitting...' : 'Submit · +15 pt'}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
            {done.length > 0 && (
              <>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Completed</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {done.map((hw) => (
                    <div key={hw.id} className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconCheck size={16} color="var(--green-600)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{hw.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Submitted</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
