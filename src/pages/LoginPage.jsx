import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IconArrowRight, IconEye, IconEyeOff, IconKey, IconLock, IconMail, IconSparkles, IconTicket, IconUserPlus, IconShieldCheck } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

const normalizeCode = value => value.trim().replace(/\s+/g, '').toUpperCase()

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthed, login, signup } = useAppStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        if (password.length < 6) {
          toast.error('비밀번호는 6자리 이상으로 입력해주세요')
          return
        }
        if (password !== confirmPassword) {
          toast.error('비밀번호 확인이 일치하지 않아요')
          return
        }
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
    <main className="auth-page v9-auth-page">
      <section className="v9-portal-card" aria-label="Cometail private English universe">
        <div className="v9-cosmos" aria-hidden="true">
          <span className="v9-cosmos-glow glow-a" />
          <span className="v9-cosmos-glow glow-b" />
          <span className="v9-cosmos-stars" />
          <motion.span className="v9-comet-line" animate={{ x: [-80, 80, -80], y: [30, -28, 30], rotate: [-13, 8, -13] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span className="v9-big-planet" animate={{ y: [-6, 8, -6], rotate: [0, 3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span className="v9-blue-planet" animate={{ y: [8, -8, 8], rotate: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <div className="v9-brand-pill"><span>☄️</span><strong>Cometail</strong><em>invite only</em></div>
        <div className="v9-hero-copy">
          <p className="eyebrow">A PRIVATE ENGLISH GALAXY</p>
          <h1>한 문장이<br />별빛이 되는 곳</h1>
          <p>영어를 쓰고, 피드백을 받고, 별빛을 모아 나만의 Comet Buddy와 행성을 성장시켜 보세요.</p>
        </div>
        <div className="v9-hero-proof">
          <span><IconShieldCheck size={16} /> 초대받은 학생만</span>
          <span><IconSparkles size={16} /> Starlight 성장</span>
          <span>🪐 모두가 함께 보는 우주</span>
        </div>
        <motion.div className="v9-floating-reward" animate={{ y: [-4, 8, -4] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
          <strong>+10</strong><span>Starlight</span>
        </motion.div>
      </section>

      <section className="v9-auth-panel" aria-label="Login and sign up">
        <div className="v9-auth-tabs" role="tablist" aria-label="Auth mode">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>로그인</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>회원가입</button>
        </div>

        <form className="v9-auth-form" onSubmit={handleSubmit}>
          <div className="v9-auth-heading">
            <div className="v9-auth-icon">{mode === 'login' ? <IconKey size={23} /> : <IconUserPlus size={23} />}</div>
            <p className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'INVITE CODE REQUIRED'}</p>
            <h2>{mode === 'login' ? '내 우주로 들어가기' : '첫 커멧을 깨워볼까요?'}</h2>
            <p>
              {mode === 'login'
                ? '오늘의 영어 기록을 남기면, 너의 커멧은 조금 더 밝아져요.'
                : 'Cometail은 선생님에게 초대받은 학생만 들어올 수 있는 작은 프라이빗 영어 우주예요.'}
            </p>
          </div>

          <label className="v9-field"><span><IconMail size={18} /> 이메일</span><input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" /></label>
          <label className="v9-field password-field"><span><IconLock size={18} /> 비밀번호</span><input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="비밀번호를 입력하세요" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><button type="button" className="password-eye" onClick={() => setShowPassword(value => !value)} aria-label="비밀번호 보기">{showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}</button></label>
          {mode === 'signup' && (
            <>
              <label className="v9-field password-field"><span><IconLock size={18} /> 비밀번호 확인</span><input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="한 번 더 입력해주세요" autoComplete="new-password" /></label>
              <label className="v9-field invite-field"><span><IconTicket size={18} /> 참여코드</span><input value={code} onChange={e => setCode(e.target.value)} placeholder="선생님에게 받은 참여코드" autoComplete="off" /></label>
              <div className="signup-name-note"><strong>가입 후 이름을 정해요</strong><span>닉네임은 다른 학생들에게 보이는 내 이름이고, Comet Buddy 이름은 내가 키우는 캐릭터의 이름이에요. 둘 다 나중에 프로필에서 바꿀 수 있어요.</span></div>
            </>
          )}

          <button className="primary-button v9-auth-submit" type="submit" disabled={loading}>
            {loading ? '별빛 확인 중...' : mode === 'login' ? '내 우주로 들어가기' : 'Cometail 여정 시작하기'} <IconArrowRight size={19} />
          </button>

          <div className="v9-private-note">
            <IconSparkles size={18} />
            <span>가입 후 기본 초대권 1장이 지급돼요. 초대권은 Cometail의 작은 우주를 조심스럽게 넓히기 위한 특별한 티켓이에요.</span>
          </div>
        </form>
      </section>
    </main>
  )
}
