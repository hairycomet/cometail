import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IconEye, IconEyeOff, IconLock, IconMail, IconSparkles, IconTicket, IconUser, IconComet } from '@tabler/icons-react'
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

  return (
    <main className="auth-page v14-auth-page">
      <section className="v14-login-phone" aria-label="Cometail login">
        <div className="v14-sky" aria-hidden="true" />
        <motion.header className="v14-login-brand" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
          <span>☄️</span>
          <strong>Cometail</strong>
        </motion.header>

        <motion.section className="v14-login-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .05 }}>
          <h1>한 문장이<br /><em>별빛이 되는 곳</em></h1>
          <p>매일 영어로 쓰고, 피드백을 받고,<br />나만의 우주를 키워보세요.</p>
        </motion.section>

        <div className="v14-comet-scene" aria-hidden="true">
          <div className="v14-comet-trail" />
          <div className="v14-buddy-silhouette">🐱</div>
        </div>

        <motion.section className="v14-glass-card" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, delay: .12 }}>
          <div className="v14-tabs" role="tablist" aria-label="Auth mode">
            <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>로그인</button>
            <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>회원가입</button>
          </div>

          <form className="v14-login-form" onSubmit={handleSubmit}>
            <label className="v14-field">
              <IconMail size={21} />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="이메일" autoComplete="email" />
            </label>

            <label className="v14-field v14-password-field">
              <IconLock size={21} />
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="비밀번호" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              <button type="button" onClick={() => setShowPassword(value => !value)} aria-label="비밀번호 보기">
                {showPassword ? <IconEyeOff size={19} /> : <IconEye size={19} />}
              </button>
            </label>

            {mode === 'signup' && (
              <div className="v14-signup-extra">
                <p><span /> 회원가입 시 추가 정보 <span /></p>
                <label className="v14-field">
                  <IconLock size={21} />
                  <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="비밀번호 확인" autoComplete="new-password" />
                </label>
                <label className="v14-field ghost-field">
                  <IconUser size={21} />
                  <input placeholder="닉네임은 다음 단계에서 정해요" disabled />
                </label>
                <label className="v14-field ghost-field">
                  <IconComet size={21} />
                  <input placeholder="코멧 버디 이름도 곧 지어요" disabled />
                </label>
                <label className="v14-field invite-field">
                  <IconTicket size={21} />
                  <input value={code} onChange={e => setCode(e.target.value)} placeholder="초대 코드" autoComplete="off" />
                </label>
              </div>
            )}

            {mode === 'login' && (
              <div className="v14-login-options">
                <label><input type="checkbox" /> 로그인 상태 유지</label>
                <button type="button" onClick={() => toast('비밀번호 재설정 기능은 곧 연결할 예정이에요')}>비밀번호 찾기</button>
              </div>
            )}

            <button className="v14-submit" type="submit" disabled={loading}>
              {loading ? '별빛 확인 중...' : '내 우주로 들어가기'} <span>☄️</span>
            </button>

            <div className="v14-private-note">
              <IconSparkles size={22} />
              <p>Cometail은 초대 기반 베타 우주입니다.<br />초대를 받은 분만 참여할 수 있어요.</p>
            </div>
          </form>
        </motion.section>
      </section>
    </main>
  )
}
