import { useState } from 'react'
import { IconCheck, IconDeviceFloppy } from '@tabler/icons-react'
import { goalTypes, themePalettes } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function SettingsPage() {
  const { user, setThemeColor, updateProfile, setDisplayMode } = useAppStore()
  const [nickname, setNickname] = useState(user.nickname)
  const [goal, setGoal] = useState(user.goal)
  const [goalType, setGoalType] = useState(user.goalType || 'English Diary')

  const save = event => {
    event.preventDefault()
    updateProfile({ nickname, goal, goalType })
  }

  return (
    <div className="page-stack settings-page">
      <div className="page-header"><div><p className="eyebrow">Personal Space</p><h1>설정</h1><p>학생이 직접 색, 모드, 목표를 바꾸게 하면 앱이 훨씬 자기 공간처럼 느껴져요.</p></div></div>
      <section className="panel wide">
        <div className="panel-title"><h2>테마색 선택</h2><span>{themePalettes.find(t => t.id === user.themeColor)?.name}</span></div>
        <div className="palette-grid">
          {themePalettes.map(palette => <button key={palette.id} className={`palette-card ${user.themeColor === palette.id ? 'selected' : ''}`} onClick={() => setThemeColor(palette.id)} style={{ '--swatch-primary': palette.primary, '--swatch-accent': palette.accent }}>
            <span>{palette.emoji}</span><strong>{palette.name}</strong>{user.themeColor === palette.id && <IconCheck size={18} />}
          </button>)}
        </div>
      </section>
      <section className="settings-grid">
        <form className="panel" onSubmit={save}>
          <div className="panel-title"><h2>학습 목표</h2><IconDeviceFloppy size={20} /></div>
          <label>닉네임<input value={nickname} onChange={e => setNickname(e.target.value)} /></label>
          <label>목표 타입<select value={goalType} onChange={e => setGoalType(e.target.value)}>{goalTypes.map(type => <option key={type}>{type}</option>)}</select></label>
          <label>개인 목표<textarea rows="4" value={goal} onChange={e => setGoal(e.target.value)} /></label>
          <button className="primary-button">저장하기</button>
        </form>
        <section className="panel">
          <div className="panel-title"><h2>표시 모드</h2><span>{user.displayMode}</span></div>
          <div className="mode-list">
            {['cute', 'clean', 'minimal', 'study'].map(mode => <button key={mode} className={user.displayMode === mode ? 'active' : ''} onClick={() => setDisplayMode(mode)}><strong>{mode}</strong><span>{mode === 'cute' ? '초등학생에게 좋은 귀여운 모드' : mode === 'clean' ? '성인 학생에게 무난한 깔끔한 모드' : mode === 'minimal' ? '꾸밈을 줄인 집중 모드' : '어두운 공부 분위기'}</span></button>)}
          </div>
        </section>
      </section>
    </div>
  )
}
