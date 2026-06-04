import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconChevronRight, IconSparkles } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import { goalTypes, storySlides, themePalettes } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { isAuthed, user, completeOnboarding } = useAppStore()
  const [step, setStep] = useState(0)
  const [nickname, setNickname] = useState(user.nickname || '')
  const [cometName, setCometName] = useState(user.cometName || 'Lumi')
  const [goal, setGoal] = useState(user.goal || '')
  const [goalType, setGoalType] = useState(user.goalType || 'English Diary')
  const [appLanguage, setAppLanguage] = useState(user.appLanguage || 'ko')
  const [themeColor, setThemeColor] = useState(user.themeColor || 'purple')
  const [saving, setSaving] = useState(false)
  const slide = storySlides[step]
  const isStory = step < storySlides.length

  if (!isAuthed) return <Navigate to="/login" replace />
  if (user.hasOnboarded) return <Navigate to="/" replace />

  const next = () => setStep(prev => Math.min(prev + 1, storySlides.length))

  const save = async event => {
    event.preventDefault()
    setSaving(true)
    try {
      await completeOnboarding({ nickname, cometName, goal, goalType, appLanguage, themeColor })
      navigate('/')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="onboarding-cinematic v9-onboarding">
      {isStory ? (
        <section className="story-card v9-story-card">
          <div className="v9-story-visual">
            <span className="v9-story-nebula" />
            <span className="v9-story-stars" />
            <motion.div className="v9-story-ring ring-one" animate={{ rotate: [0, 360] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="v9-story-ring ring-two" animate={{ rotate: [360, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="v9-story-planet" animate={{ scale: [1, 1.05, 1], y: [-4, 5, -4] }} transition={{ duration: 5, repeat: Infinity }} />
            <motion.div className="v9-birth-core" animate={{ scale: [0.92, 1.08, 0.92], opacity: [.72, 1, .72] }} transition={{ duration: 2.8, repeat: Infinity }} />
            <motion.div className="v9-story-comet" animate={{ x: [-18, 22, -18], y: [18, -18, 18] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <CometAvatar level={step * 9 + 1} equipped={[]} />
            </motion.div>
            <span className="story-emoji v9-story-emoji">{slide.emoji}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="v9-story-copy">
              <p className="eyebrow">Cometail Origin {step + 1}/{storySlides.length}</p>
              <h1>{slide.titleKo}</h1>
              <h2>{slide.titleEn}</h2>
              <p>{slide.bodyKo}</p>
              <p className="story-en">{slide.bodyEn}</p>
              <div className="v9-story-progress" aria-label="Story progress">
                {storySlides.map((item, index) => <span key={item.id} className={index <= step ? 'active' : ''} />)}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="story-actions no-skip-actions v9-story-actions">
            <button className="primary-button" onClick={next}>{step === storySlides.length - 1 ? '내 Comet Buddy 만나기' : '다음 별빛 보기'} <IconChevronRight size={18} /></button>
          </div>
        </section>
      ) : (
        <form className="setup-card universe-setup v9-setup" onSubmit={save}>
          <div className="v9-setup-preview">
            <span className="v9-setup-glow" />
            <CometAvatar level={1} equipped={[]} preview />
          </div>
          <div className="v9-setup-form">
            <div className="section-heading centered">
              <p className="eyebrow">Wake your first comet</p>
              <h1>이제 너의 Comet Buddy를 깨워요</h1>
              <p>처음에는 한국어 도움을 받을 수 있어요. 레벨이 오르면 Cometail은 자연스럽게 영어 중심의 우주로 전환됩니다.</p>
            </div>
            <label>닉네임<span className="field-help">다른 학생들에게 보이는 내 이름이에요. 나중에 프로필에서 바꿀 수 있어요.</span><input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="앱에서 사용할 이름" /></label>
            <label>Comet Buddy 이름<span className="field-help">내가 키우게 될 캐릭터의 이름이에요. 닉네임과 같아도 되고 달라도 괜찮아요.</span><input value={cometName} onChange={e => setCometName(e.target.value)} placeholder="예: Lumi, Nova, Aster" /></label>
            <label>앱 언어<select value={appLanguage} onChange={e => setAppLanguage(e.target.value)}><option value="ko">한국어 도움 받기</option><option value="en">English only</option></select></label>
            <label>목표 타입<select value={goalType} onChange={e => setGoalType(e.target.value)}>{goalTypes.map(type => <option key={type}>{type}</option>)}</select></label>
            <label>이번 달 영어 목표<span className="field-help">이번 달에 Cometail로 가장 먼저 이루고 싶은 작은 목표를 적어주세요.</span><textarea value={goal} onChange={e => setGoal(e.target.value)} rows="3" placeholder="예: 매일 영어 일기 3문장 쓰기" /></label>
            <div className="mini-palette-row v9-palette-row">
              {themePalettes.slice(0, 6).map(theme => <button type="button" key={theme.id} className={themeColor === theme.id ? 'active' : ''} onClick={() => setThemeColor(theme.id)}>{theme.emoji} {theme.name}</button>)}
            </div>
            <button className="primary-button" disabled={saving}><IconSparkles size={18} /> {saving ? '별빛 저장 중...' : '내 커멧 시작하기'}</button>
          </div>
        </form>
      )}
    </div>
  )
}
