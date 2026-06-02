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
  const slide = storySlides[step]
  const isStory = step < storySlides.length

  if (!isAuthed) return <Navigate to="/login" replace />
  if (user.hasOnboarded) return <Navigate to="/" replace />

  const next = () => setStep(prev => Math.min(prev + 1, storySlides.length))
  const save = event => {
    event.preventDefault()
    completeOnboarding({ nickname, cometName, goal, goalType, appLanguage, themeColor })
    navigate('/')
  }

  return (
    <div className="onboarding-cinematic">
      {isStory ? (
        <section className="story-card">
          <div className="story-animation">
            <motion.div className="story-planet" animate={{ scale: [1, 1.06, 1], rotate: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.div className="story-comet" animate={{ x: [-30, 35, -30], y: [20, -16, 20] }} transition={{ duration: 5, repeat: Infinity }}><CometAvatar level={step * 8 + 1} equipped={[]} /></motion.div>
            <span className="story-emoji">{slide.emoji}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="story-copy">
              <p className="eyebrow">Cometail Story {step + 1}/{storySlides.length}</p>
              <h1>{slide.titleEn}</h1>
              <h2>{slide.titleKo}</h2>
              <p>{slide.bodyEn}</p>
              <p>{slide.bodyKo}</p>
            </motion.div>
          </AnimatePresence>
          <div className="story-actions">
            <button className="secondary-button" onClick={() => setStep(storySlides.length)}>Skip</button>
            <button className="primary-button" onClick={next}>Next <IconChevronRight size={18} /></button>
          </div>
        </section>
      ) : (
        <form className="setup-card universe-setup" onSubmit={save}>
          <div className="section-heading centered">
            <p className="eyebrow">Start your Cometail</p>
            <h1>이제 너의 Comet Buddy를 시작해요</h1>
            <p>처음에는 한국어와 영어 중 선택할 수 있어요. 레벨이 오르면 자연스럽게 English Universe로 전환됩니다.</p>
          </div>
          <label>닉네임<input value={nickname} onChange={e => setNickname(e.target.value)} /></label>
          <label>Comet Buddy 이름<input value={cometName} onChange={e => setCometName(e.target.value)} /></label>
          <label>앱 언어<select value={appLanguage} onChange={e => setAppLanguage(e.target.value)}><option value="ko">한국어 도움 받기</option><option value="en">English only</option></select></label>
          <label>목표 타입<select value={goalType} onChange={e => setGoalType(e.target.value)}>{goalTypes.map(type => <option key={type}>{type}</option>)}</select></label>
          <label>이번 달 영어 목표<textarea value={goal} onChange={e => setGoal(e.target.value)} rows="3" /></label>
          <div className="mini-palette-row">
            {themePalettes.slice(0, 6).map(theme => <button type="button" key={theme.id} className={themeColor === theme.id ? 'active' : ''} onClick={() => setThemeColor(theme.id)}>{theme.emoji} {theme.name}</button>)}
          </div>
          <button className="primary-button"><IconSparkles size={18} /> 내 커멧 시작하기</button>
        </form>
      )}
    </div>
  )
}
