import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, getDocs, orderBy, doc, updateDoc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import { IconUsers, IconNotebook, IconChecklist, IconStar, IconComet, IconPlus, IconCheck, IconX, IconMoon, IconSun } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function AdminPage() {
  const { userProfile, theme, toggleTheme } = useStore();
  const [tab, setTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hwForm, setHwForm] = useState({ title: '', description: '', dueDate: '', cometNote: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsSnap, diariesSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('points', 'desc'))),
        getDocs(query(collection(db, 'diaries'), orderBy('createdAt', 'desc'))),
      ]);
      setStudents(studentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setDiaries(diariesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleFeedback = async (diaryId, feedback) => {
    await updateDoc(doc(db, 'diaries', diaryId), { feedback });
    setDiaries(prev => prev.map(d => d.id === diaryId ? { ...d, feedback } : d));
    toast.success('Feedback saved!');
  };

  const handleFeature = async (diaryId, featured) => {
    await updateDoc(doc(db, 'diaries', diaryId), { featured, featuredAt: featured ? serverTimestamp() : null });
    setDiaries(prev => prev.map(d => d.id === diaryId ? { ...d, featured } : d));
    toast.success(featured ? '⭐ Featured!' : 'Removed from featured');
  };

  const handleAddHomework = async () => {
    if (!hwForm.title || !hwForm.dueDate) { toast.error('Add title and due date'); return; }
    const studentUids = students.map(s => s.uid).filter(Boolean);
    await addDoc(collection(db, 'homework'), {
      ...hwForm,
      assignedTo: studentUids,
      createdAt: serverTimestamp(),
      dueDate: new Date(hwForm.dueDate),
      submissions: {},
    });
    toast.success('Homework assigned!');
    setHwForm({ title: '', description: '', dueDate: '', cometNote: '' });
  };

  const today = dayjs().format('YYYY-MM-DD');
  const todayDiaries = diaries.filter(d => d.date === today);
  const pendingFeedback = diaries.filter(d => !d.feedback).length;

  const TABS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'diaries', label: 'Diaries' },
    { id: 'students', label: 'Students' },
    { id: 'homework', label: 'Homework' },
  ];

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '52px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconComet size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-main)', fontSize: 18, fontWeight: 900, color: 'var(--purple-800)' }}>Cometail Admin</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Welcome, {userProfile?.nickname}</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {theme === 'light' ? <IconMoon size={17} color="var(--text-secondary)" /> : <IconSun size={17} color="var(--text-secondary)" />}
        </motion.button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '12px 16px 0', gap: 8, scrollbarWidth: 'none' }}>
        {TABS.map((t) => (
          <motion.button key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(t.id)}
            style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 'var(--radius-full)', background: tab === t.id ? 'var(--purple-600)' : 'var(--bg-primary)', color: tab === t.id ? 'white' : 'var(--text-secondary)', fontWeight: 700, fontSize: 13, border: tab === t.id ? 'none' : '1px solid var(--border)', whiteSpace: 'nowrap' }}>
            {t.label}
          </motion.button>
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { icon: IconNotebook, label: "Today's diaries", value: `${todayDiaries.length}/${students.length}`, color: 'var(--purple-600)' },
                { icon: IconStar, label: 'Pending feedback', value: pendingFeedback, color: 'var(--amber-600)' },
                { icon: IconUsers, label: 'Total students', value: students.length, color: 'var(--teal-600)' },
                { icon: IconChecklist, label: 'Total diaries', value: diaries.length, color: 'var(--purple-400)' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="card" style={{ padding: '14px 16px' }}>
                  <Icon size={18} color={color} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Latest diaries</p>
              {diaries.slice(0, 5).map((diary) => (
                <div key={diary.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{diary.nickname}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{dayjs(diary.date).format('MMM D')}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{diary.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diaries */}
        {tab === 'diaries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {diaries.map((diary) => (
              <DiaryAdminCard key={diary.id} diary={diary} onFeedback={handleFeedback} onFeature={handleFeature} />
            ))}
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {students.map((s, i) => (
              <div key={s.id} className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--purple-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--purple-600)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{s.nickname}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>({s.realName})</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>🔥 {s.streak || 0} · 📓 {s.totalDiaries || 0} · {s.examType}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple-600)' }}>{(s.points || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Homework */}
        {tab === 'homework' && (
          <div>
            <div className="card" style={{ padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-main)', marginBottom: 14 }}>Assign new homework</p>
              {[
                { key: 'title', placeholder: 'Homework title', label: 'Title' },
                { key: 'description', placeholder: 'What should students do?', label: 'Description', multiline: true },
                { key: 'cometNote', placeholder: 'Optional note for students', label: "Comet's note" },
              ].map(({ key, placeholder, label, multiline }) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                  {multiline ? (
                    <textarea value={hwForm[key]} onChange={(e) => setHwForm(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--bg-secondary)', resize: 'none', minHeight: 70, outline: 'none' }} />
                  ) : (
                    <input value={hwForm[key]} onChange={(e) => setHwForm(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', background: 'var(--bg-secondary)', outline: 'none' }} />
                  )}
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Due date</label>
                <input type="date" value={hwForm.dueDate} onChange={(e) => setHwForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', background: 'var(--bg-secondary)', outline: 'none' }} />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddHomework} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <IconPlus size={18} /> Assign to all students
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DiaryAdminCard({ diary, onFeedback, onFeature }) {
  const [feedback, setFeedback] = useState(diary.feedback || '');
  const [editing, setEditing] = useState(false);
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{diary.nickname}</span>
          {diary.featured && <span style={{ fontSize: 10, background: 'var(--amber-50)', color: 'var(--amber-800)', padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>⭐ Featured</span>}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{dayjs(diary.date).format('MMM D')} · {diary.wordCount}w</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{diary.content}</p>
      {editing ? (
        <div>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Leave feedback..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--bg-secondary)', resize: 'none', minHeight: 70, outline: 'none', marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { onFeedback(diary.id, feedback); setEditing(false); }}
              style={{ flex: 1, padding: '9px', background: 'var(--purple-600)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <IconCheck size={15} /> Save
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditing(false)}
              style={{ padding: '9px 14px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderRadius: 10, fontWeight: 700, fontSize: 13 }}>
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditing(true)}
            style={{ flex: 1, padding: '8px', background: 'var(--purple-50)', color: 'var(--purple-600)', borderRadius: 10, fontWeight: 700, fontSize: 12, border: '1px solid var(--purple-200)' }}>
            {diary.feedback ? 'Edit feedback' : '☄️ Add feedback'}
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => onFeature(diary.id, !diary.featured)}
            style={{ padding: '8px 12px', background: diary.featured ? 'var(--amber-50)' : 'var(--bg-tertiary)', color: diary.featured ? 'var(--amber-800)' : 'var(--text-secondary)', borderRadius: 10, fontWeight: 700, fontSize: 12, border: `1px solid ${diary.featured ? 'var(--amber-400)' : 'var(--border)'}` }}>
            {diary.featured ? '⭐' : '☆'} Pick
          </motion.button>
        </div>
      )}
    </div>
  );
}
