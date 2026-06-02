import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IconLock, IconMail, IconSparkles } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { invitationCodes } from '../data/content'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthed, login, signup } = useAppStore()
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
    if (mode === 'signup') {
      signup({ email })
      navigate('/onboarding')
      return
    }
    login({ email })
    navigate('/')
  }

  return (
    <div className="auth-page cinematic-login">
      <section className="auth-hero">
        <div className="hero-orbit"><span>☄️</span></div>
        <div className="mini-stars"><i /><i /><i /><i /></div>
        <p className="eyebrow">Private English Universe</p>
        <h1>Every sentence becomes starlight.</h1>
        <p>Cometail은 커멧 영어 학생들만 들어오는 프라이빗 영어 우주예요. 영어 일기, 선생님 피드백, 별빛 포인트, 캐릭터 꾸미기, 그리고 모두가 함께 보는 Cometail Universe가 이어집니다.</p>
        <div className="hero-badges">
          <span>Daily Diary</span><span>Teacher Feedback</span><span>Comet Buddy</span><span>Universe</span>
        </div>
      </section>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-switch">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>Join</button>
        </div>
        <h2>{mode === 'login' ? 'Cometail로 돌아가기' : '초대받은 학생만 가입할 수 있어요'}</h2>
        <label><IconMail size={18} /> 이메일<input value={email} onChange={e => setEmail(e.target.value)} type="email" /></label>
        <label><IconLock size={18} /> 비밀번호<input value={password} onChange={e => setPassword(e.target.value)} type="password" /></label>
        {mode === 'signup' && <label><IconSparkles size={18} /> 초대코드<input value={code} onChange={e => setCode(e.target.value)} /></label>}
        <button className="primary-button" type="submit">{mode === 'login' ? 'Cometail 들어가기' : '가입하고 세계관 보기'}</button>
        <p className="helper-text">관리자 테스트는 hairycomet@gmail.com 또는 teacher가 포함된 이메일로 로그인하면 Teacher 메뉴가 보여요.</p>
      </form>
    </div>
  )
}
