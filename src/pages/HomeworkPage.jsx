import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, getDocs, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import { IconChecklist, IconClock, IconCheck, IconAlertCircle, IconStar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function HomeworkPage() {
  const { user, userProfile, updateProfile } = useStore();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [answerText, setAnswerText] = useState({});

  useEffect(() => {
    if (!user) return;
    fetchHomework();
  }, [user]);

  const fetchHomework = async () => {
    try {
      // Get ALL homework - filter client side since array-contains can be tricky
      const snap = await getDocs(query(collection(db, 'homework'), orderBy('dueDate', 'asc')));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Show homework assigned to this user OR all homework (if assignedTo includes uid)
      const mine = all.filter(hw => 
        !hw.assignedTo || 
        hw.assignedTo.length === 0 || 
        hw.assignedTo.includes(user.uid)
      );
      setHomework(mine);
    } catch (e) {
      console.error('Homework fetch error:', e);
    }
    setLoading(false);
  };

  const handleSubmit = async (hwId) => {
    const text = answerText[hwId]?.trim();
    if (!text) { toast.error('Write your answer first!'); return; }
    setSubmitting(hwId);
    try {
      await updateDoc(doc(db, 'homework', hwId), {
        [`submissions.${user.uid}`]: {
          content: text,
          submittedAt: serverTimestamp(),
          uid: user.uid,
          nickname: userProfile?.nickname || 'Student',
        }
      });
      // Update points
      await updateDoc(doc(db, 'users', user.uid), {
        points: (userProfile?.points || 0) + 15,
      });
      updateProfile({ points: (userProfile?.points || 0) + 15 });
      setHomework(prev => prev.map(h => h.id === hwId
        ? { ...h, submissions: { ...(h.submissions || {}), [user.uid]: { content: text } } }
        : h
      ));
      toast.success('Submitted! +15 pt 🎉');
    } catch (e) {
      console.error(e);
      toast.error('Failed to submit — check your connection');
    }
    setSubmitting(null);
  };

  const isSubmitted = (hw) => hw.submissions?.[user?.uid];
  const isOverdue = (hw) => {
    const due = hw.dueDate?.toDate?.() || new Date(hw.dueDate);
    return dayjs(due).isBefore(dayjs(), 'day');
  };
  const formatDue = (hw) => {
    const due = hw.dueDate?.toDate?.() || new Date(hw.dueDate);
    return dayjs(due).format('MMM D');
  };

  const pending = homework.filter(h => !isSubmitted(h));
  const done = homework.filter(h => isSubmitted(h));

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-main)' }}>Homework</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          {pending.length > 0 ? `${pending.length} pending` : 'All done! ✅'} · {done.length} completed
        </p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : homework.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, fontFamily: 'var(--font-main)', fontSize: 16 }}>No homework yet!</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Comet will assign tasks here. Check back later!</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Pending ({pending.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {pending.map((hw, i) => (
                    <motion.div key={hw.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="card"
                      style={{ padding: 16, border: isOverdue(hw) ? '1.5px solid var(--red-400)' : '1px solid var(--border)' }}>

                      {/* Header */}
                      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: isOverdue(hw) ? 'var(--red-50)' : 'var(--purple-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isOverdue(hw)
                            ? <IconAlertCircle size={20} color="var(--red-600)" />
                            : <IconChecklist size={20} color="var(--purple-600)" />
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', fontFamily: 'var(--font-main)', marginBottom: 3 }}>{hw.title}</p>
                          {hw.description && (
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 5 }}>{hw.description}</p>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <IconClock size={12} color={isOverdue(hw) ? 'var(--red-400)' : 'var(--text-tertiary)'} />
                              <span style={{ fontSize: 11, color: isOverdue(hw) ? 'var(--red-600)' : 'var(--text-tertiary)', fontWeight: isOverdue(hw) ? 700 : 400 }}>
                                {isOverdue(hw) ? 'Overdue · ' : 'Due · '}{formatDue(hw)}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <IconStar size={11} color="var(--purple-400)" />
                              <span style={{ fontSize: 11, color: 'var(--purple-600)', fontWeight: 700 }}>+15 pt</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comet's note */}
                      {hw.cometNote && (
                        <div style={{ padding: '10px 12px', background: 'var(--purple-50)', borderRadius: 10, marginBottom: 12, fontSize: 13, color: 'var(--purple-800)', display: 'flex', gap: 8, border: '1px solid var(--purple-200)' }}>
                          <span style={{ flexShrink: 0 }}>☄️</span>
                          <span style={{ lineHeight: 1.5 }}>{hw.cometNote}</span>
                        </div>
                      )}

                      {/* Answer textarea */}
                      <textarea
                        value={answerText[hw.id] || ''}
                        onChange={(e) => setAnswerText(prev => ({ ...prev, [hw.id]: e.target.value }))}
                        placeholder="Write your answer in English..."
                        style={{
                          width: '100%', minHeight: 90, padding: '12px',
                          fontSize: 14, fontFamily: 'var(--font-body)',
                          color: 'var(--text-primary)', background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border)', borderRadius: 10,
                          resize: 'none', outline: 'none', marginBottom: 10, lineHeight: 1.6,
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--purple-400)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />

                      <motion.button whileTap={{ scale: 0.97 }}
                        onClick={() => handleSubmit(hw.id)}
                        disabled={submitting === hw.id || !answerText[hw.id]?.trim()}
                        className="btn-primary"
                        style={{ fontSize: 14, opacity: !answerText[hw.id]?.trim() ? 0.5 : 1 }}>
                        {submitting === hw.id
                          ? <><div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Submitting...</>
                          : <><IconCheck size={16} /> Submit · +15 pt</>
                        }
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {done.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Completed ({done.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {done.map((hw) => (
                    <div key={hw.id} className="card" style={{ padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.75 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconCheck size={18} color="var(--green-600)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{hw.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Submitted ✓</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
