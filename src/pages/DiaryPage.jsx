import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { IconPlus, IconMessageCircle2, IconBook2 } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import Heatmap from '../components/Heatmap'

export default function DiaryPage() {
  const { diaries, saveExpression } = useAppStore()
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Daily English Diary</p>
          <h1>영어 일기</h1>
          <p>학생은 부담 없이 쓰고, 선생님은 교정본, 자연스러운 표현, 암기 표현까지 남길 수 있는 구조입니다.</p>
        </div>
        <div className="header-actions"><Link className="secondary-button" to="/notebook"><IconBook2 size={18} /> 보관함</Link><Link className="primary-button" to="/diary/new"><IconPlus size={18} /> 새 일기</Link></div>
      </div>
      <section className="panel wide"><Heatmap diaries={diaries} /></section>
      <div className="feed-list">
        {diaries.map(diary => (
          <article className="diary-card" key={diary.id}>
            <div className="diary-meta"><span>{dayjs(diary.createdAt).format('MMM D, HH:mm')}</span><strong>+{diary.points}pt</strong></div>
            <h2>{diary.title}</h2>
            <p>{diary.content}</p>
            {diary.feedback ? <div className="feedback-box"><IconMessageCircle2 size={18} /><span>{diary.feedback}</span></div> : <div className="waiting-feedback">선생님 피드백 대기 중</div>}
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
