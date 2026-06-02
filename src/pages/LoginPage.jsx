import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IconLock, IconMail, IconSparkles, IconTicket, IconArrowRight, IconPlanet } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { invitationCodes } from '../data/content'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthed, login, signup } = useAppStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  if (isAuthed) return <Navigate to="/" replace />

  const handleSubmit = event => {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요')
      return
    }

    if (mode === 'signup') {
      if (!normalizedCode) {
        toast.error('참여코드를 입력해주세요')
        return
      }
      if (!invitationCodes.includes(normalizedCode)) {
        toast.error('참여코드를 다시 확인해주세요')
        return
      }
      signup({ email, inviteCode: normalizedCode })
      navigate('/onboarding')
      return
    }

    login({ email })
    navigate('/')
  }

  return (
    <div className="auth-page cinematic-login refined-login">
      <section className="auth-hero refined-hero" aria-label="Cometail intro">
        <div className="cosmic-sky" aria-hidden="true">
          <motion.span className="star star-a" animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.35, 1] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.span className="star star-b" animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.25, 1] }} transition={{ duration: 4.4, repeat: Infinity }} />
          <motion.span className="star star-c" animate={{ opacity: [0.25, 1, 0.25], scale: [1, 1.5, 1] }} transition={{ duration: 5.2, repeat: Infinity }} />
          <motion.div className="login-comet-trail" animate={{ x: [-80, 12, -80], y: [36, -10, 36], rotate: [-9, 4, -9] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
            <span />
          </motion.div>
          <motion.div className="floating-planet main-planet" animate={{ y: [-8, 8, -8], rotate: [0, 4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="floating-planet mini-planet" animate={{ y: [6, -6, 6], rotate: [0, -8, 0] }} transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>

        <div className="hero-content">
          <p className="eyebrow">PRIVATE ENGLISH UNIVERSE</p>
          <h1>한 문장이 별빛이 되는 곳</h1>
          <p className="hero-lead">
            영어를 쓰고, 피드백을 받고, 별빛을 모아 나만의 Comet Buddy와 우주를 성장시켜 보세요.
          </p>
          <div className="hero-badges refined-badges">
            <span>매일 쓰기</span>
            <span>선생님 피드백</span>
            <span>커멧 성장</span>
            <span>함께하는 우주</span>
          </div>
        </div>
      </section>

      <form className="auth-card refined-auth-card" onSubmit={handleSubmit}>
        <div className="auth-switch refined-switch">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>로그인</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>회원가입</button>
        </div>

        <div className="auth-title-block">
          <div className="auth-icon-bubble">{mode === 'login' ? <IconPlanet size={22} /> : <IconTicket size={22} />}</div>
          <h2>{mode === 'login' ? '내 우주로 들어가기' : '초대받은 학생만 시작할 수 있어요'}</h2>
          <p>{mode === 'login'
            ? 'Cometail에 로그인하고 오늘의 별빛을 모아보세요.'
            : '선생님에게 받은 참여코드를 입력하면 나만의 Comet Buddy가 시작돼요.'}</p>
        </div>

        <label><IconMail size={18} /> 이메일<input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" /></label>
        <label><IconLock size={18} /> 비밀번호<input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="비밀번호를 입력하세요" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        {mode === 'signup' && (
          <label><IconSparkles size={18} /> 참여코드<input value={code} onChange={e => setCode(e.target.value)} placeholder="선생님에게 받은 코드를 입력하세요" autoComplete="off" /></label>
        )}

        <button className="primary-button refined-auth-button" type="submit">
          {mode === 'login' ? 'Cometail 들어가기' : '가입하고 세계관 시작하기'} <IconArrowRight size={18} />
        </button>
        <p className="helper-text invite-only-note">
          Cometail은 선생님에게 초대받은 학생만 들어올 수 있는 프라이빗 영어 우주예요.
        </p>
      </form>
    </div>
  )
}
