import { useState } from 'react'
import { IconCheck, IconDeviceFloppy, IconLanguage, IconLock } from '@tabler/icons-react'
import { goalTypes, themePalettes } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function SettingsPage() {
  const { user, setThemeColor, updateProfile, setDisplayMode, setLanguage } = useAppStore()
  const [nickname, setNickname] = useState(user.nickname)
  const [cometName, setCometName] = useState(user.cometName || 'Lumi')
  const [goal, setGoal] = useState(user.goal)
  const [goalType, setGoalType] = useState(user.goalType || 'English Diary')
  const [diaryVisibilityDefault, setDiaryVisibilityDefault] = useState(user.diaryVisibilityDefault || 'private')
  const englishLocked = user.level >= 20

  const save = event => {
    event.preventDefault()
    updateProfile({ nickname, cometName, goal, goalType, diaryVisibilityDefault })
  }

  return (
    <div className="page-stack settings-page">
      <div className="page-header"><div><p className="eyebrow">Personal Space</p><h1>설정</h1><p>초반에는 한국어 도움을 받을 수 있고, 레벨이 오르면 자연스럽게 영어 중심 Cometail로 전환됩니다.</p></div></div>
      <section className="panel wide">
        <div className="panel-title"><h2>테마 선택</h2><span>{themePalettes.find(t => t.id === user.themeColor)?.name}</span></div>
        <div className="palette-grid strong-palette">
          {themePalettes.map(palette => <button key={palette.id} className={`palette-card ${user.themeColor === palette.id ? 'selected' : ''}`} onClick={() => setThemeColor(palette.id)} style={{ '--swatch-primary': palette.primary, '--swatch-accent': palette.accent, '--swatch-bg1': palette.bg1, '--swatch-bg2': palette.bg2 }}>
            <span>{palette.emoji}</span><strong>{palette.name}</strong><small>{palette.vibe}</small>{user.themeColor === palette.id && <IconCheck size={18} />}
          </button>)}
        </div>
      </section>
      <section className="settings-grid">
        <form className="panel" onSubmit={save}>
          <div className="panel-title"><h2>학습 목표</h2><IconDeviceFloppy size={20} /></div>
          <label>닉네임<input value={nickname} onChange={e => setNickname(e.target.value)} /></label>
          <label>Comet Buddy 이름<input value={cometName} onChange={e => setCometName(e.target.value)} /></label>
          <label>목표 타입<select value={goalType} onChange={e => setGoalType(e.target.value)}>{goalTypes.map(type => <option key={type}>{type}</option>)}</select></label>
          <label>일기 기본 공개 범위<select value={diaryVisibilityDefault} onChange={e => setDiaryVisibilityDefault(e.target.value)}><option value="private">나만 보기</option><option value="teacher">선생님에게 제출</option><option value="class">클래스 피드 공개</option><option value="community">Cometail Universe 공개</option></select></label>
          <label>개인 목표<textarea rows="4" value={goal} onChange={e => setGoal(e.target.value)} /></label>
          <button className="primary-button">저장하기</button>
        </form>
        <section className="panel">
          <div className="panel-title"><h2>언어 설정</h2><IconLanguage size={20} /></div>
          <div className="language-box">
            {englishLocked && <div className="locked-note"><IconLock size={18} /> Level 20부터는 English Universe가 기본이에요.</div>}
            <button className={user.appLanguage === 'ko' && !englishLocked ? 'active' : ''} disabled={englishLocked} onClick={() => setLanguage('ko')}>한국어 도움 받기<span>초반 학생을 위한 안내와 버튼</span></button>
            <button className={user.appLanguage === 'en' || englishLocked ? 'active' : ''} onClick={() => setLanguage('en')}>English only<span>Cometail을 영어 환경으로 사용</span></button>
          </div>
          <div className="panel-title mode-title"><h2>화면 분위기</h2><span>{user.displayMode}</span></div>
          <div className="mode-list">
            {['default', 'calm', 'sparkle'].map(mode => <button key={mode} className={user.displayMode === mode ? 'active' : ''} onClick={() => setDisplayMode(mode)}><strong>{mode}</strong><span>{mode === 'default' ? '기본 Cometail 분위기' : mode === 'calm' ? '성인 학생에게도 부담 없는 차분한 느낌' : '별빛과 애니메이션이 더 강한 느낌'}</span></button>)}
          </div>
        </section>
      </section>
    </div>
  )
}
