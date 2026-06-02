import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import DiaryPage from './pages/DiaryPage'
import DiaryNewPage from './pages/DiaryNewPage'
import TypingPage from './pages/TypingPage'
import HomeworkPage from './pages/HomeworkPage'
import ShopPage from './pages/ShopPage'
import WardrobePage from './pages/WardrobePage'
import UniversePage from './pages/UniversePage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import SettingsPage from './pages/SettingsPage'
import NotebookPage from './pages/NotebookPage'
import { useAppStore } from './store/useAppStore'

function ProtectedRoute({ children }) {
  const { isAuthed, user } = useAppStore()
  if (!isAuthed) return <Navigate to="/login" replace />
  if (!user.hasOnboarded) return <Navigate to="/onboarding" replace />
  return children
}

function AdminRoute({ children }) {
  const { isAuthed, user } = useAppStore()
  if (!isAuthed) return <Navigate to="/login" replace />
  if (!user.isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="diary" element={<DiaryPage />} />
        <Route path="diary/new" element={<DiaryNewPage />} />
        <Route path="typing" element={<TypingPage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="wardrobe" element={<WardrobePage />} />
        <Route path="universe" element={<UniversePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="notebook" element={<NotebookPage />} />
        <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
