import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IconArrowRight, IconKey, IconLock, IconMail, IconSparkles, IconTicket, IconUserPlus } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

const normalizeCode = value => value.trim().replace(/\s+/g, '').toUpperCase()

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthed, login, signup } = useAppStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthed) return <Navigate to="/" replace />

  const handleSubmit = async event => {
    event.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()
    const normalizedCode = normalizeCode(code)

    if (!trimmedEmail || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        if (!normalizedCode) {
          toast.error('참여코드를 입력해주세요')
          return
        }
        const ok = await signup({ email: trimmedEmail, password, inviteCode: normalizedCode })
        if (!ok) return
        navigate('/onboarding')
        return
      }

      const ok = await login({ email: trimmedEmail, password })
      if (ok) navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page v5-auth-page">
      <section className="v5-login-hero" aria-label="Cometail private English universe">
        <div className="v5-space-scene" aria-hidden="true">
          <span className="v5-nebula nebula-one" />
          <span className="v5-nebula nebula-two" />
          <span className="v5-starfield" />
          <motion.span className="v5-shooting-comet" animate={{ x: [-48, 18, -48], y: [24, -12, 24], rotate: [-12, 5, -12] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span className="v5-planet v5-planet-main" animate={{ y: [-8, 8, -8], rotate: [0, 4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span className="v5-planet v5-planet-small" animate={{ y: [8, -8, 8], rotate: [0, -9, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="v5-orbit-card" animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <strong>+10</strong>
            <span>Starlight</span>
          </motion.div>
        </div>

        <div className="v5-hero-copy">
          <div className="v5-logo-lockup"><span>☄️</span><strong>Cometail</strong></div>
          <p className="eyebrow">INVITE ONLY ENGLISH UNIVERSE</p>
          <h1>영어가 별빛이 되는<br />프라이빗 우주</h1>
          <p>
            영어를 쓰고, 선생님 피드백을 받고, 별빛을 모아 나만의 Comet Buddy와 행성을 성장시켜 보세요.
          </p>
          <div className="v5-hero-tags">
            <span>초대받은 학생만</span>
            <span>Daily Writing</span>
            <span>Starlight</span>
            <span>Comet Buddy</span>
          </div>
        </div>
      </section>

      <section className="v5-auth-panel" aria-label="Login and sign up">
        <div className="v5-auth-tabs" role="tablist" aria-label="Auth mode">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>로그인</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>회원가입</button>
        </div>

        <form className="v5-auth-form" onSubmit={handleSubmit}>
          <div className="v5-auth-heading">
            <div className="v5-auth-icon">{mode === 'login' ? <IconKey size={24} /> : <IconUserPlus size={24} />}</div>
            <p className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'START WITH INVITE CODE'}</p>
            <h2>{mode === 'login' ? '내 우주로 들어가기' : '새 커멧 시작하기'}</h2>
            <p>
              {mode === 'login'
                ? '오늘의 영어 기록을 남기고, 커멧에게 새로운 별빛을 채워주세요.'
                : 'Cometail은 선생님에게 초대받은 학생만 들어올 수 있어요. 받은 참여코드를 입력해 주세요.'}
            </p>
          </div>

          <label className="v5-field"><span><IconMail size={18} /> 이메일</span><input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" /></label>
          <label className="v5-field"><span><IconLock size={18} /> 비밀번호</span><input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="비밀번호를 입력하세요" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
          {mode === 'signup' && (
            <label className="v5-field"><span><IconTicket size={18} /> 참여코드</span><input value={code} onChange={e => setCode(e.target.value)} placeholder="선생님에게 받은 코드를 입력하세요" autoComplete="off" /></label>
          )}

          <button className="primary-button v5-auth-submit" type="submit" disabled={loading}>
            {loading ? '확인 중...' : mode === 'login' ? 'Cometail 들어가기' : '가입하고 세계관 시작하기'} <IconArrowRight size={19} />
          </button>

          <div className="v5-private-note">
            <IconSparkles size={18} />
            <span>가입 후 모든 학생에게 기본 초대권 1장이 지급돼요. Cometail은 작은 프라이빗 커뮤니티로 운영됩니다.</span>
          </div>
        </form>
      </section>
    </main>
  )
}
