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
    <div className="onboarding-cinematic refined-onboarding">
      {isStory ? (
        <section className="story-card refined-story-card">
          <div className="story-animation refined-story-animation">
            <div className="story-stars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <motion.div className="story-planet" animate={{ scale: [1, 1.06, 1], rotate: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.div className="story-orbit-ring" animate={{ rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="story-comet" animate={{ x: [-30, 35, -30], y: [20, -16, 20] }} transition={{ duration: 5, repeat: Infinity }}><CometAvatar level={step * 8 + 1} equipped={[]} /></motion.div>
            <span className="story-emoji">{slide.emoji}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="story-copy refined-story-copy">
              <p className="eyebrow">Cometail Story {step + 1}/{storySlides.length}</p>
              <h1>{slide.titleKo}</h1>
              <h2>{slide.titleEn}</h2>
              <p>{slide.bodyKo}</p>
              <p className="story-en">{slide.bodyEn}</p>
            </motion.div>
          </AnimatePresence>
          <div className="story-actions no-skip-actions">
            <button className="primary-button" onClick={next}>{step === storySlides.length - 1 ? '내 커멧 만들기' : '계속 보기'} <IconChevronRight size={18} /></button>
          </div>
        </section>
      ) : (
        <form className="setup-card universe-setup refined-setup" onSubmit={save}>
          <div className="section-heading centered">
            <p className="eyebrow">Start your Cometail</p>
            <h1>이제 너의 Comet Buddy를 시작해요</h1>
            <p>처음에는 한국어 도움을 받을 수 있어요. 레벨이 오르면 Cometail은 자연스럽게 영어 중심의 우주로 전환됩니다.</p>
          </div>
          <label>닉네임<input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="앱에서 사용할 이름" /></label>
          <label>Comet Buddy 이름<input value={cometName} onChange={e => setCometName(e.target.value)} placeholder="예: Lumi, Nova, Aster" /></label>
          <label>앱 언어<select value={appLanguage} onChange={e => setAppLanguage(e.target.value)}><option value="ko">한국어 도움 받기</option><option value="en">English only</option></select></label>
          <label>목표 타입<select value={goalType} onChange={e => setGoalType(e.target.value)}>{goalTypes.map(type => <option key={type}>{type}</option>)}</select></label>
          <label>이번 달 영어 목표<textarea value={goal} onChange={e => setGoal(e.target.value)} rows="3" placeholder="예: 매일 영어 일기 3문장 쓰기" /></label>
          <div className="mini-palette-row">
            {themePalettes.slice(0, 6).map(theme => <button type="button" key={theme.id} className={themeColor === theme.id ? 'active' : ''} onClick={() => setThemeColor(theme.id)}>{theme.emoji} {theme.name}</button>)}
          </div>
          <button className="primary-button"><IconSparkles size={18} /> 내 커멧 시작하기</button>
        </form>
      )}
    </div>
  )
}
