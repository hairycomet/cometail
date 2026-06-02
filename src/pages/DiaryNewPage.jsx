import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconRefresh, IconSparkles } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { scoreWriting } from '../utils/stats'

export default function DiaryNewPage() {
  const navigate = useNavigate()
  const { currentPrompt, rotatePrompt, addDiary } = useAppStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const score = useMemo(() => scoreWriting(content), [content])

  const submit = event => {
    event.preventDefault()
    if (content.trim().length < 10) return
    addDiary({ title, content })
    navigate('/diary')
  }

  return (
    <div className="write-page">
      <section className="writing-card">
        <div className="prompt-card">
          <div><p className="eyebrow">Today’s prompt</p><h1>{currentPrompt}</h1></div>
          <button className="icon-button" onClick={rotatePrompt} type="button"><IconRefresh size={20} /></button>
        </div>
        <form onSubmit={submit} className="writing-form">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Write freely. Mistakes are welcome here." value={content} onChange={e => setContent(e.target.value)} rows="12" />
          <button className="primary-button" disabled={content.trim().length < 10}><IconSparkles size={18} /> 저장하고 10pt 받기</button>
        </form>
      </section>
      <aside className="writing-sidebar">
        <div className="panel"><h2>Live writing check</h2><div className="mini-stats"><span>Words <strong>{score.words}</strong></span><span>Sentences <strong>{score.sentences}</strong></span><span>Variety <strong>{score.variety}</strong></span></div><div className="progress-track"><div style={{ width: `${score.readiness}%` }} /></div><p className="muted">120 words에 가까워질수록 좋은 연습이 됩니다.</p></div>
        <div className="tip-card"><strong>Useful starter</strong><p>Today, I would like to write about...</p><p>One thing I learned today was...</p><p>At first, I felt..., but later I realized...</p></div>
      </aside>
    </div>
  )
}
