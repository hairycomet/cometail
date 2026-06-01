import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection, query, getDocs, orderBy, doc, updateDoc,
  addDoc, serverTimestamp, where, increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import {
  IconUsers, IconNotebook, IconChecklist, IconStar,
  IconComet, IconPlus, IconCheck, IconMoon, IconSun,
  IconFlame, IconRefresh, IconX
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const TABS = [
  { id: 'dashboard', label: '📊 Overview' },
  { id: 'diaries',   label: '📓 Diaries'  },
  { id: 'students',  label: '👥 Students' },
  { id: 'homework',  label: '📋 Tasks'    },
];

export default function AdminPage() {
  const { userProfile, theme, toggleTheme } = useStore();
  const [tab, setTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hwForm, setHwForm] = useState({ title: '', description: '', dueDate: '', cometNote: '' });
  const [feedbackMap, setFeedbackMap] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [studentsSnap, diariesSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('points', 'desc'))),
        getDocs(query(collection(db, 'diaries'), orderBy('createdAt', 'desc'))),
      ]);
      const s = studentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const d = diariesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setStudents(s);
      setDiaries(d);
      // Init feedback map
      const fm = {};
      d.forEach(diary => { fm[diary.id] = diary.feedback || ''; });
      setFeedbackMap(fm);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load data');
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveFeedback = async (diaryId) => {
    const feedback = feedbackMap[diaryId]?.trim();
    if (!feedback) return;
    try {
      await updateDoc(doc(db, 'diaries', diaryId), { feedback });
      setDiaries(prev => prev.map(d => d.id === diaryId ? { ...d, feedback } : d));
      setEditingId(null);
      toast.success('Feedback saved! ☄️');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save');
    }
  };

  const toggleFeature = async (diaryId, featured) => {
    try {
      await updateDoc(doc(db, 'diaries', diaryId), {
        featured: !featured,
        featuredAt: !featured ? serverTimestamp() : null,
      });
      setDiaries(prev => prev.map(d => d.id === diaryId ? { ...d, featured: !featured } : d));
      toast.success(!featured ? '⭐ Featured!' : 'Removed from featured');
    } catch (e) {
      console.error(e);
      toast.error('Failed');
    }
  };

  const addGiftPoints = async (studentId, amount) => {
    try {
      await updateDoc(doc(db, 'users', studentId), { points: increment(amount) });
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, points: (s.points || 0) + amount } : s));
      toast.success(`+${amount} pt gifted! 🎁`);
    } catch (e) {
      console.error(e);
      toast.error('Failed');
    }
  };

  const submitHomework = async () => {
    if (!hwForm.title.trim() || !hwForm.dueDate) {
      toast.error('Title and due date required');
      return;
    }
    try {
      const studentUids = students.filter(s => s.role !== 'admin').map(s => s.id);
      await addDoc(collection(db, 'homework'), {
        title: hwForm.title.trim(),
        description: hwForm.description.trim(),
        cometNote: hwForm.cometNote.trim(),
        dueDate: new Date(hwForm.dueDate),
        assignedTo: studentUids,
        submissions: {},
        createdAt: serverTimestamp(),
      });
      setHwForm({ title: '', description: '', dueDate: '', cometNote: '' });
      toast.success('Homework assigned to all students! 📋');
    } catch (e) {
      console.error(e);
      toast.error('Failed to assign');
    }
  };

  const today = dayjs().format('YYYY-MM-DD');
  const todayDiaries = diaries.filter(d => d.date === today);
  const pendingFeedback = diaries.filter(d => !d.feedback).length;
  const studentCount = students.filter(s => s.role !== 'admin').length;

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 20 }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)',
        padding: 'calc(52px + env(safe-area-inset-top, 0px)) 20px 14px',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconComet size={18} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 900, fontFamily: 'var(--font-main)', color: 'var(--purple-800)' }}>Admin Dashboard</h1>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{dayjs().format('dddd, MMM D')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={fetchData} disabled={refreshing}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconRefresh size={16} color="var(--text-secondary)" style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'light' ? <IconMoon size={16} color="var(--text-secondary)" /> : <IconSun size={16} color="var(--text-secondary)" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 16px', gap: 8, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {TABS.map((t) => (
          <motion.button key={t.id} whileTap={{ scale: 0.94 }} onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0, padding: '8px 16px', borderRadius: 20,
              background: tab === t.id ? 'var(--purple-600)' : 'var(--bg-primary)',
              color: tab === t.id ? 'white' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: 13,
              border: tab === t.id ? 'none' : '1px solid var(--border)',
              whiteSpace: 'nowrap', fontFamily: 'var(--font-main)',
            }}>
            {t.label}
          </motion.button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : (
          <>
            {/* DASHBOARD */}
            {tab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    { icon: IconNotebook, label: "Today's diaries", value: `${todayDiaries.length}/${studentCount}`, color: 'var(--purple-600)', bg: 'var(--purple-50)' },
                    { icon: IconStar,     label: 'Need feedback',   value: pendingFeedback,    color: 'var(--amber-600)', bg: 'var(--amber-50)' },
                    { icon: IconUsers,    label: 'Students',        value: studentCount,        color: 'var(--teal-600)',  bg: 'var(--teal-50)' },
                    { icon: IconChecklist,label: 'Total diaries',   value: diaries.length,      color: 'var(--purple-400)', bg: 'var(--purple-50)' },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="card" style={{ padding: '14px 16px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <Icon size={18} color={color} />
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick diary list */}
                <div className="card" style={{ padding: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Recent diaries</p>
                  {diaries.slice(0, 6).map((d, i) => (
                    <div key={d.id} style={{ padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{d.nickname}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{dayjs(d.date).format('M/D')} · {d.wordCount}w</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.content}</p>
                      </div>
                      {!d.feedback && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber-400)', flexShrink: 0, marginTop: 4 }} />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DIARIES */}
            {tab === 'diaries' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {diaries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>No diaries yet</div>
                  ) : diaries.map((d) => (
                    <div key={d.id} className="card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{d.nickname}</span>
                          {d.featured && <span style={{ fontSize: 10, background: 'var(--amber-50)', color: 'var(--amber-800)', padding: '2px 7px', borderRadius: 20, fontWeight: 700, border: '1px solid var(--amber-400)' }}>⭐ Featured</span>}
                          {!d.feedback && <span style={{ fontSize: 10, background: 'var(--red-50)', color: 'var(--red-600)', padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>Needs feedback</span>}
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{dayjs(d.date).format('MMM D')} · {d.wordCount}w</span>
                      </div>

                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{d.content}</p>

                      {d.feedback && editingId !== d.id && (
                        <div style={{ padding: '8px 12px', background: 'var(--purple-50)', borderRadius: 10, marginBottom: 10, fontSize: 12, color: 'var(--purple-800)', display: 'flex', gap: 6 }}>
                          <span>☄️</span><span>{d.feedback}</span>
                        </div>
                      )}

                      {editingId === d.id ? (
                        <div>
                          <textarea
                            value={feedbackMap[d.id] || ''}
                            onChange={(e) => setFeedbackMap(prev => ({ ...prev, [d.id]: e.target.value }))}
                            placeholder="Write feedback in English..."
                            autoFocus
                            style={{ width: '100%', minHeight: 80, padding: '10px 12px', border: '1.5px solid var(--purple-400)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--bg-secondary)', resize: 'none', outline: 'none', marginBottom: 8, lineHeight: 1.6 }}
                          />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => saveFeedback(d.id)}
                              style={{ flex: 1, padding: '9px', background: 'var(--purple-600)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                              <IconCheck size={15} /> Save feedback
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditingId(null)}
                              style={{ padding: '9px 14px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderRadius: 10, fontWeight: 700, fontSize: 13 }}>
                              <IconX size={15} />
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditingId(d.id)}
                            style={{ flex: 1, padding: '8px', background: 'var(--purple-50)', color: 'var(--purple-600)', borderRadius: 10, fontWeight: 700, fontSize: 12, border: '1px solid var(--purple-200)' }}>
                            {d.feedback ? '✏️ Edit feedback' : '☄️ Add feedback'}
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleFeature(d.id, d.featured)}
                            style={{ padding: '8px 12px', background: d.featured ? 'var(--amber-50)' : 'var(--bg-tertiary)', color: d.featured ? 'var(--amber-800)' : 'var(--text-secondary)', borderRadius: 10, fontWeight: 700, fontSize: 12, border: `1px solid ${d.featured ? 'var(--amber-400)' : 'var(--border)'}` }}>
                            {d.featured ? '⭐' : '☆'} Pick
                          </motion.button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STUDENTS */}
            {tab === 'students' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {students.filter(s => s.role !== 'admin').map((s, i) => (
                    <div key={s.id} className="card" style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--purple-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--purple-600)', fontSize: 14, flexShrink: 0, border: '1.5px solid var(--purple-200)' }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{s.nickname}</span>
                            {s.realName && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>({s.realName})</span>}
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>🔥 {s.streak || 0}d</span>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>📓 {s.totalDiaries || 0}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>⌨️ {s.typingBest || 0} wpm</span>
                            <span style={{ fontSize: 11, background: 'var(--purple-50)', color: 'var(--purple-600)', padding: '1px 6px', borderRadius: 20, fontWeight: 700 }}>{s.examType || 'other'}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--purple-600)', fontFamily: 'var(--font-main)' }}>{(s.points || 0).toLocaleString()}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>points</div>
                        </div>
                      </div>
                      {/* Gift points */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[50, 100, 200].map(amt => (
                          <motion.button key={amt} whileTap={{ scale: 0.92 }} onClick={() => addGiftPoints(s.id, amt)}
                            style={{ flex: 1, padding: '7px 4px', background: 'var(--purple-50)', color: 'var(--purple-600)', borderRadius: 8, fontWeight: 700, fontSize: 12, border: '1px solid var(--purple-200)' }}>
                            +{amt} pt
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* HOMEWORK */}
            {tab === 'homework' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="card" style={{ padding: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-main)', marginBottom: 14 }}>📋 Assign homework</p>
                  
                  {[
                    { key: 'title', label: 'Title *', placeholder: 'e.g. Weekly diary (5 entries)' },
                    { key: 'description', label: 'Description', placeholder: 'What should students do?', multi: true },
                    { key: 'cometNote', label: "Comet's note (shown to students)", placeholder: 'Optional tip or reminder...', multi: true },
                  ].map(({ key, label, placeholder, multi }) => (
                    <div key={key} style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                      {multi ? (
                        <textarea value={hwForm[key]} onChange={(e) => setHwForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                          style={{ width: '100%', padding: '11px 13px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--bg-secondary)', resize: 'none', minHeight: 70, outline: 'none', lineHeight: 1.6 }} />
                      ) : (
                        <input value={hwForm[key]} onChange={(e) => setHwForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                          style={{ width: '100%', padding: '11px 13px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', background: 'var(--bg-secondary)', outline: 'none' }} />
                      )}
                    </div>
                  ))}

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Due date *</label>
                    <input type="date" value={hwForm.dueDate} onChange={(e) => setHwForm(p => ({ ...p, dueDate: e.target.value }))}
                      style={{ width: '100%', padding: '11px 13px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', background: 'var(--bg-secondary)', outline: 'none' }} />
                  </div>

                  <motion.button whileTap={{ scale: 0.97 }} onClick={submitHomework}
                    className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <IconPlus size={18} /> Assign to all {studentCount} students
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
