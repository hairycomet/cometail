import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, completeOnboarding } = useAppStore()
  const [nickname, setNickname] = useState(user.nickname)
  const [goal, setGoal] = useState(user.goal)
  const [level, setLevel] = useState('I can write simple sentences')

  const save = event => {
    event.preventDefault()
    completeOnboarding({ nickname, goal, startingLevel: level })
    navigate('/')
  }

  return (
    <div className="onboarding-page">
      <div className="section-heading centered">
        <p className="eyebrow">Welcome aboard</p>
        <h1>Cometail에서 어떤 영어 습관을 만들까요?</h1>
        <p>처음 들어온 학생에게는 목표를 짧게 설정하게 해서 앱을 “숙제장”이 아니라 “내 성장 공간”처럼 느끼게 만드는 흐름입니다.</p>
      </div>
      <form className="setup-card" onSubmit={save}>
        <label>닉네임<input value={nickname} onChange={e => setNickname(e.target.value)} /></label>
        <label>이번 달 영어 목표<textarea value={goal} onChange={e => setGoal(e.target.value)} rows="3" /></label>
        <label>현재 느낌<select value={level} onChange={e => setLevel(e.target.value)}><option>I can write simple sentences</option><option>I want to sound more natural</option><option>I need test score improvement</option><option>I want daily speaking confidence</option></select></label>
        <button className="primary-button">시작하기</button>
      </form>
    </div>
  )
}
