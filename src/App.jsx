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
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import { useAppStore } from './store/useAppStore'

function ProtectedRoute({ children }) {
  const isAuthed = useAppStore(state => state.isAuthed)
  return isAuthed ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="diary" element={<DiaryPage />} />
        <Route path="diary/new" element={<DiaryNewPage />} />
        <Route path="typing" element={<TypingPage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
