import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { useStore } from './store';
import './styles/global.css';

import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import DiaryPage from './pages/DiaryPage';
import DiaryNewPage from './pages/DiaryNewPage';
import TypingPage from './pages/TypingPage';
import HomeworkPage from './pages/HomeworkPage';
import ProfilePage from './pages/ProfilePage';
import ShopPage from './pages/ShopPage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, userProfile } = useStore();
  if (!user) return <Navigate to="/login" />;
  if (user.isNew) return <Navigate to="/onboarding" />;
  if (adminOnly && userProfile?.role !== 'admin') return <Navigate to="/home" />;
  return children;
}

export default function App() {
  const { user, setUser, setUserProfile, theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUser(firebaseUser);
          setUserProfile(snap.data());
        } else {
          setUser({ ...firebaseUser, isNew: true });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });
    return unsub;
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-main)',
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 12,
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          },
          success: { iconTheme: { primary: 'var(--teal-400)', secondary: 'white' } },
          error: { iconTheme: { primary: 'var(--red-400)', secondary: 'white' } },
        }}
      />
      <Routes>
        <Route path="/login" element={user && !user.isNew ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/diary" element={<ProtectedRoute><DiaryPage /></ProtectedRoute>} />
        <Route path="/diary/new" element={<ProtectedRoute><DiaryNewPage /></ProtectedRoute>} />
        <Route path="/typing" element={<ProtectedRoute><TypingPage /></ProtectedRoute>} />
        <Route path="/homework" element={<ProtectedRoute><HomeworkPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user && !user.isNew ? '/home' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}
