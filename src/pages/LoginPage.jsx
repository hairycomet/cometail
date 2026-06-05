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
    <main className="auth-page v13-auth-page">
      <section className="v13-hero" aria-label="Cometail intro">
        <div className="v13-hero-image" />
        <div className="v13-hero-shade" />
        <div className="v13-hero-content">
          <motion.div
            className="v13-logo"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
          >
            <span className="v13-logo-mark">☄️</span>
            <strong>Cometail</strong>
          </motion.div>
          <motion.div
            className="v13-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .08 }}
          >
            <h1>한 문장이<br />별빛이 되는 곳</h1>
            <p>영어로 쓰고, 피드백을 받고,<br />당신만의 우주를 성장시켜요.</p>
          </motion.div>
          <motion.div
            className="v13-feature-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .16 }}
          >
            <span><IconSparkles size={17} /> Daily Writing</span>
            <span><IconShieldCheck size={17} /> Teacher Feedback</span>
            <span>🪐 Private Universe</span>
          </motion.div>
        </div>
      </section>

      <section className="v13-auth-panel" aria-label="Login and sign up">
        <div className="v13-auth-tabs" role="tablist" aria-label="Auth mode">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>로그인</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>회원가입</button>
        </div>

        <form className="v13-auth-form" onSubmit={handleSubmit}>
          <div className="v13-auth-heading">
            <div className="v13-auth-icon">{mode === 'login' ? <IconKey size={22} /> : <IconUserPlus size={22} />}</div>
            <p className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'INVITE ONLY'}</p>
            <h2>{mode === 'login' ? '다시 만나서 반가워요' : 'Cometail에 초대받았나요?'}</h2>
            <p>
              {mode === 'login'
                ? '당신의 우주가 기다리고 있어요.'
                : '초대코드를 입력하면 나만의 작은 영어 우주가 열려요.'}
            </p>
          </div>

          <label className="v13-field">
            <span><IconMail size={18} /> 이메일</span>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" autoComplete="email" />
          </label>

          <label className="v13-field password-field">
            <span><IconLock size={18} /> 비밀번호</span>
            <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="비밀번호를 입력하세요" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            <button type="button" className="password-eye v13-eye" onClick={() => setShowPassword(value => !value)} aria-label="비밀번호 보기">
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </label>

          {mode === 'signup' && (
            <>
              <label className="v13-field password-field">
                <span><IconLock size={18} /> 비밀번호 확인</span>
                <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="한 번 더 입력해주세요" autoComplete="new-password" />
              </label>
              <label className="v13-field invite-field">
                <span><IconTicket size={18} /> 참여코드</span>
                <input value={code} onChange={e => setCode(e.target.value)} placeholder="선생님에게 받은 참여코드" autoComplete="off" />
              </label>
              <div className="v13-name-note">
                <strong>닉네임과 Comet Buddy는 달라요</strong>
                <span>닉네임은 다른 학생들에게 보이는 내 이름이고, Comet Buddy는 내가 키우는 캐릭터의 이름이에요. 둘 다 나중에 바꿀 수 있어요.</span>
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="v13-login-options">
              <label><input type="checkbox" /> 로그인 상태 유지</label>
              <button type="button" onClick={() => toast('비밀번호 재설정 기능은 곧 연결할 예정이에요')}>비밀번호 찾기</button>
            </div>
          )}

          <button className="primary-button v13-auth-submit" type="submit" disabled={loading}>
            {loading ? '별빛 확인 중...' : mode === 'login' ? '내 우주로 들어가기' : 'Cometail 여정 시작하기'} <IconArrowRight size={19} />
          </button>

          <div className="v13-private-note">
            <IconSparkles size={18} />
            <span>{mode === 'login' ? 'Cometail은 당신의 문장을 소중히 간직해요. 안심하고 나만의 우주를 만들어가세요.' : 'Cometail은 초대받은 학생만 들어오는 작은 프라이빗 영어 우주예요.'}</span>
          </div>
        </form>
      </section>
    </main>
  )
}
