import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IconLock, IconMail, IconSparkles } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { invitationCodes } from '../data/content'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthed, login } = useAppStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('student@cometail.app')
  const [password, setPassword] = useState('cometail')
  const [code, setCode] = useState('COMET2026')

  if (isAuthed) return <Navigate to="/" replace />

  const handleSubmit = event => {
    event.preventDefault()
    if (mode === 'signup' && !invitationCodes.includes(code.trim().toUpperCase())) {
      toast.error('초대코드를 다시 확인해주세요')
      return
    }
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요')
      return
    }
    login({ email })
    navigate(mode === 'signup' ? '/onboarding' : '/')
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="hero-orbit"><span>☄️</span></div>
        <p className="eyebrow">Private English Learning Club</p>
        <h1>오늘 쓴 한 문장이 내일의 영어 실력이 되는 곳</h1>
        <p>Cometail은 커멧 영어 학생들만 들어오는 프라이빗 영어 커뮤니티예요. 일기, 숙제, 타자 연습, 피드백, 포인트를 한 곳에서 관리합니다.</p>
        <div className="hero-badges">
          <span>Daily Diary</span><span>Teacher Feedback</span><span>Streak</span>
        </div>
      </section>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-switch">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>Join</button>
        </div>
        <h2>{mode === 'login' ? '다시 만나서 반가워요' : '초대받은 학생만 가입할 수 있어요'}</h2>
        <label><IconMail size={18} /> 이메일<input value={email} onChange={e => setEmail(e.target.value)} type="email" /></label>
        <label><IconLock size={18} /> 비밀번호<input value={password} onChange={e => setPassword(e.target.value)} type="password" /></label>
        {mode === 'signup' && <label><IconSparkles size={18} /> 초대코드<input value={code} onChange={e => setCode(e.target.value)} /></label>}
        <button className="primary-button" type="submit">{mode === 'login' ? 'Cometail 들어가기' : '가입하고 시작하기'}</button>
        <p className="helper-text">현재 버전은 데모 데이터로 바로 확인할 수 있게 만들어두었어요. Firebase 연결 후 실제 데이터로 바꿀 수 있습니다.</p>
      </form>
    </div>
  )
}
