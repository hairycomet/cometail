import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { IconBook2, IconEye, IconMessageCircle2, IconPlus } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import Heatmap from '../components/Heatmap'

const filters = ['all', 'private', 'teacher', 'class', 'community', 'waiting', 'reviewed']

export default function DiaryPage() {
  const { diaries, saveExpression } = useAppStore()
  const [filter, setFilter] = useState('all')
  const filtered = useMemo(() => diaries.filter(diary => {
    if (filter === 'all') return true
    if (filter === 'waiting') return diary.visibility === 'teacher' && !diary.feedback
    if (filter === 'reviewed') return Boolean(diary.feedback || diary.corrected || diary.natural)
    return diary.visibility === filter
  }), [diaries, filter])
  return (
    <div className="page-stack diary-page-upgraded">
      <div className="page-header">
        <div>
          <p className="eyebrow">Daily English Diary</p>
          <h1>영어 일기</h1>
          <p>기본은 나만 보기예요. 피드백을 받고 싶은 글만 선생님에게 제출하고, 원하는 글만 공개할 수 있어요.</p>
        </div>
        <div className="header-actions"><Link className="secondary-button" to="/notebook"><IconBook2 size={18} /> 보관함</Link><Link className="primary-button" to="/diary/new"><IconPlus size={18} /> 새 일기</Link></div>
      </div>
      <section className="panel wide"><Heatmap diaries={diaries} /></section>
      <div className="filter-pills sticky-filter">{filters.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="feed-list">
        {filtered.map(diary => (
          <article className="diary-card" key={diary.id}>
            <div className="diary-meta"><span>{dayjs(diary.createdAt).format('MMM D, HH:mm')}</span><strong>{diary.visibility}</strong><em>+{diary.points}✨</em></div>
            <h2>{diary.title}</h2>
            <p>{diary.content}</p>
            {diary.visibility === 'private' && <div className="privacy-note"><IconEye size={16} /> 나만 볼 수 있는 개인 기록입니다.</div>}
            {diary.feedback ? <div className="feedback-box"><IconMessageCircle2 size={18} /><span>{diary.feedback}</span></div> : diary.visibility === 'teacher' ? <div className="waiting-feedback">선생님 피드백 대기 중</div> : null}
            {(diary.corrected || diary.natural || diary.expression) && <div className="correction-grid">
              {diary.corrected && <div><strong>Corrected</strong><p>{diary.corrected}</p></div>}
              {diary.natural && <div><strong>Natural</strong><p>{diary.natural}</p></div>}
              {diary.expression && <div><strong>Expression</strong><p>{diary.expression}</p><button className="secondary-button" onClick={() => saveExpression(diary.expression)}>표현 저장</button></div>}
            </div>}
          </article>
        ))}
      </div>
    </div>
  )
}
