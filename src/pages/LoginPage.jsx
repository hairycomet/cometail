import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IconEye, IconEyeOff, IconLock, IconMail, IconSparkles, IconTicket } from '@tabler/icons-react'
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
          toast.error('초대코드를 입력해주세요')
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

  const isSignup = mode === 'signup'

  return (
    <main className="v15-auth-page">
      <section className="v15-login-shell" aria-label="Cometail login">
        <div className="v15-stars" aria-hidden="true" />
        <div className="v15-aurora" aria-hidden="true" />
        <div className="v15-orbit" aria-hidden="true">
          <span className="v15-comet-head" />
        </div>
        <div className="v15-horizon" aria-hidden="true" />
        <div className="v15-buddy" aria-hidden="true">
          <span className="ear left" />
          <span className="ear right" />
          <span className="body" />
          <span className="cape" />
          <span className="tail-star">✦</span>
        </div>

        <motion.header className="v15-brand" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <span className="v15-brand-mark">☄️</span>
          <strong>Cometail</strong>
        </motion.header>

        <motion.section className="v15-hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .56, delay: .05 }}>
          <h1>한 문장이<br /><em>별빛이 되는 곳</em></h1>
          <p>매일 영어로 쓰고,<br />나만의 우주를 키워보세요.</p>
        </motion.section>

        <motion.section className="v15-auth-sheet" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .58, delay: .08 }}>
          <div className="v15-tabs" role="tablist" aria-label="로그인 또는 회원가입">
            <button type="button" className={!isSignup ? 'selected' : ''} onClick={() => setMode('login')}>로그인</button>
            <button type="button" className={isSignup ? 'selected' : ''} onClick={() => setMode('signup')}>회원가입</button>
          </div>

          <form className="v15-form" onSubmit={handleSubmit}>
            <label className="v15-field">
              <IconMail size={21} />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="이메일" autoComplete="email" />
            </label>

            <label className="v15-field password">
              <IconLock size={21} />
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="비밀번호" autoComplete={isSignup ? 'new-password' : 'current-password'} />
              <button type="button" onClick={() => setShowPassword(value => !value)} aria-label="비밀번호 보기">
                {showPassword ? <IconEyeOff size={19} /> : <IconEye size={19} />}
              </button>
            </label>

            {isSignup && (
              <div className="v15-signup-fields">
                <label className="v15-field">
                  <IconLock size={21} />
                  <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="비밀번호 확인" autoComplete="new-password" />
                </label>
                <label className="v15-field invite">
                  <IconTicket size={21} />
                  <input value={code} onChange={e => setCode(e.target.value)} placeholder="초대 코드" autoComplete="off" />
                </label>
                <p className="v15-signup-note">닉네임과 Comet Buddy 이름은 입장 후에 정해요.</p>
              </div>
            )}

            {!isSignup && (
              <div className="v15-options">
                <label><input type="checkbox" /> 로그인 상태 유지</label>
                <button type="button" onClick={() => toast('비밀번호 재설정 기능은 곧 연결할 예정이에요')}>비밀번호 찾기</button>
              </div>
            )}

            <button className="v15-submit" type="submit" disabled={loading}>
              {loading ? '별빛 확인 중...' : '내 우주로 들어가기'} <span>☄️</span>
            </button>

            <div className="v15-private-note">
              <IconSparkles size={20} />
              <p>Cometail은 초대 기반 베타 우주예요.<br />초대를 받은 분만 먼저 입장할 수 있어요.</p>
            </div>
          </form>
        </motion.section>
      </section>
    </main>
  )
}
