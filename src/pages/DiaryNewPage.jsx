import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconRefresh, IconSparkles } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { scoreWriting } from '../utils/stats'

export default function DiaryNewPage() {
  const navigate = useNavigate()
  const { currentPrompt, rotatePrompt, addDiary, user } = useAppStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [wantsFeedback, setWantsFeedback] = useState(false)
  const [visibility, setVisibility] = useState(user.diaryVisibilityDefault || 'private')
  const score = useMemo(() => scoreWriting(content), [content])

  const finalVisibility = wantsFeedback ? 'teacher' : visibility
  const [saving, setSaving] = useState(false)

  const submit = async event => {
    event.preventDefault()
    if (content.trim().length < 10) return
    setSaving(true)
    try {
      await addDiary({ title, content, visibility: finalVisibility, feedbackRequested: wantsFeedback })
      navigate('/diary')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="write-page upgraded-write-page">
      <section className="writing-card">
        <div className="prompt-card">
          <div><p className="eyebrow">Today’s prompt</p><h1>{currentPrompt}</h1><p>어렵게 쓰지 않아도 괜찮아요. 오늘의 한 문장이 별빛이 됩니다.</p></div>
          <button className="icon-button" onClick={rotatePrompt} type="button" aria-label="Change prompt"><IconRefresh size={20} /></button>
        </div>
        <form onSubmit={submit} className="writing-form">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Write freely. Mistakes are welcome here." value={content} onChange={e => setContent(e.target.value)} rows="12" />
          <div className="privacy-card">
            <label className="toggle-line"><input type="checkbox" checked={wantsFeedback} onChange={e => setWantsFeedback(e.target.checked)} /> 선생님 피드백을 받고 싶어요</label>
            <label className="visibility-select">공개 범위<select value={visibility} onChange={e => setVisibility(e.target.value)} disabled={wantsFeedback}><option value="private">나만 보기</option><option value="class">클래스 피드 공개</option><option value="community">Cometail Universe 공개</option></select></label>
            <p>{wantsFeedback ? '피드백 요청 글은 선생님에게 제출됩니다.' : '기본값은 나만 보기입니다. 원할 때만 공개하세요.'}</p>
          </div>
          <button className="primary-button" disabled={content.trim().length < 10 || saving}><IconSparkles size={18} /> {saving ? '저장 중...' : '저장하고 10 Starlight 받기'}</button>
        </form>
      </section>
      <aside className="writing-sidebar">
        <div className="panel"><h2>Live writing check</h2><div className="mini-stats"><span>Words <strong>{score.words}</strong></span><span>Sentences <strong>{score.sentences}</strong></span><span>Variety <strong>{score.variety}</strong></span></div><div className="progress-track"><div style={{ width: `${score.readiness}%` }} /></div><p className="muted">120 words에 가까워질수록 좋은 연습이 됩니다.</p></div>
        <div className="tip-card"><strong>Useful starter</strong><p>Today, I would like to write about...</p><p>One thing I learned today was...</p><p>At first, I felt..., but later I realized...</p></div>
      </aside>
    </div>
  )
}
