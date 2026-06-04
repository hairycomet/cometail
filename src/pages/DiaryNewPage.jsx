import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IconBookmark, IconRefresh, IconSparkles } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { scoreWriting } from '../utils/stats'

export default function DiaryNewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentPrompt, rotatePrompt, addDiary, user, setDiaryDraft } = useAppStore()
  const draft = user.diaryDraft || {}
  const [title, setTitle] = useState(draft.title || '')
  const [content, setContent] = useState(draft.content || searchParams.get('insert') || '')
  const [wantsFeedback, setWantsFeedback] = useState(Boolean(draft.wantsFeedback) || false)
  const [visibility, setVisibility] = useState(draft.visibility || user.diaryVisibilityDefault || 'private')
  const [saving, setSaving] = useState(false)
  const score = useMemo(() => scoreWriting(content), [content])
  const finalVisibility = wantsFeedback ? 'teacher' : visibility
  const patterns = user.savedPatterns || []
  const expressions = user.savedExpressions || []

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) setDiaryDraft({ title, content, wantsFeedback, visibility })
    }, 500)
    return () => clearTimeout(timer)
  }, [title, content, wantsFeedback, visibility, setDiaryDraft])

  const insertText = text => {
    setContent(prev => `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}${text}`)
  }

  const submit = async event => {
    event.preventDefault()
    if (content.trim().length < 10) return
    setSaving(true)
    try {
      await addDiary({ title, content, visibility: finalVisibility, feedbackRequested: wantsFeedback })
      setDiaryDraft(null)
      navigate('/diary')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="write-page upgraded-write-page v11-write-page">
      <section className="writing-card">
        <div className="prompt-card">
          <div><p className="eyebrow">Today’s prompt</p><h1>{currentPrompt}</h1><p>어렵게 쓰지 않아도 괜찮아요. 오늘의 한 문장이 별빛이 됩니다.</p></div>
          <button className="icon-button" onClick={rotatePrompt} type="button" aria-label="Change prompt"><IconRefresh size={20} /></button>
        </div>
        <form onSubmit={submit} className="writing-form">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Write freely. Mistakes are welcome here." value={content} onChange={e => setContent(e.target.value)} rows="12" />
          <div className="draft-save-note"><IconBookmark size={16} /> 작성 중인 내용은 자동으로 임시 저장돼요. 문장 보관함을 보고 돌아와도 지워지지 않아요.</div>
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
        <div className="panel v11-writing-bank"><div className="panel-title"><h2>문장 보관함</h2><Link to="/notebook">전체 보기</Link></div><p className="muted">배운 패턴을 눌러 일기에 바로 넣을 수 있어요.</p>{patterns.slice(0, 4).map(pattern => <button key={pattern.id || pattern.pattern} onClick={() => insertText(pattern.example || pattern.pattern)}><strong>{pattern.pattern}</strong><span>{pattern.meaning || pattern.example}</span></button>)}{expressions.slice(0, 3).map(expression => <button key={expression} onClick={() => insertText(expression)}><strong>{expression}</strong><span>저장한 표현</span></button>)}</div>
      </aside>
    </div>
  )
}
