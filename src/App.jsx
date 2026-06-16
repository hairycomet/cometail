import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import AppShell from './components/AppShell'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import PairHomePage from './pages/PairHomePage'
import PairDiaryPage from './pages/PairDiaryPage'
import MatePage from './pages/MatePage'
import OurUniversePage from './pages/OurUniversePage'
import MyCometPage from './pages/MyCometPage'
import ArchivePage from './pages/ArchivePage'
import { useAppStore } from './store/useAppStore'

function LoadingGate() {
  return <main className="loading-gate"><div className="spinner-orbit" /><p>별빛 신호를 찾는 중...</p></main>
}

function Protected({ children }) {
  const { isAuthed, isAuthReady, user } = useAppStore()
  if (!isAuthReady) return <LoadingGate />
  if (!isAuthed) return <Navigate to="/login" replace />
  if (!user.hasOnboarded) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  const initializeAuth = useAppStore(state => state.initializeAuth)
  useEffect(() => initializeAuth?.(), [initializeAuth])

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<Protected><AppShell /></Protected>}>
          <Route index element={<PairHomePage />} />
          <Route path="diary" element={<PairDiaryPage />} />
          <Route path="mate" element={<MatePage />} />
          <Route path="universe" element={<OurUniversePage />} />
          <Route path="me" element={<MyCometPage />} />
          <Route path="archive" element={<ArchivePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
