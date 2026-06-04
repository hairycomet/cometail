import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { IconBookmarkPlus, IconKeyboard, IconPencilPlus, IconSparkles } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'

export default function NotebookPage() {
  const { diaries, user, saveExpression, savePattern, reviewExpression } = useAppStore()
  const feedbacks = diaries.filter(diary => diary.feedback || diary.corrected || diary.natural || diary.expression)
  const patterns = user.savedPatterns || []
  const expressions = user.savedExpressions || []
  return (
    <div className="page-stack v11-notebook-page">
      <div className="page-header"><div><p className="eyebrow">Pattern Bank</p><h1>문장 보관함</h1><p>피드백에서 배운 문장 패턴을 모아두고, 다시 일기와 타자 연습으로 연결하는 공간이에요.</p></div><Link className="primary-button" to="/diary/new"><IconPencilPlus size={18} /> 보관함 보며 일기 쓰기</Link></div>
      <section className="panel wide pattern-bank-panel">
        <div className="panel-title"><h2>내 문장 패턴</h2><span>{patterns.length} patterns</span></div>
        <div className="pattern-grid">
          {patterns.length === 0 && <div className="empty-state"><IconSparkles size={28} /><strong>아직 저장된 패턴이 없어요.</strong><p>선생님 피드백을 받으면 “I like to ~” 같은 문장 패턴이 여기에 쌓입니다.</p></div>}
          {patterns.map(pattern => <article key={pattern.id || pattern.pattern} className="pattern-card"><strong>{pattern.pattern}</strong><p>{pattern.meaning}</p><em>{pattern.example}</em><div><Link to={`/diary/new?insert=${encodeURIComponent(pattern.example || pattern.pattern)}`}>일기에 사용</Link><button onClick={() => reviewExpression(pattern.pattern)}>복습 +5</button></div></article>)}
        </div>
      </section>
      <section className="panel wide">
        <div className="panel-title"><h2>Saved expressions</h2><span>{expressions.length} expressions</span></div>
        <div className="expression-bank">{expressions.map(expression => <span key={expression}>{expression}<Link to={`/diary/new?insert=${encodeURIComponent(expression)}`}>Use</Link><button onClick={() => reviewExpression(expression)}>{user.reviewedExpressions?.includes(expression) ? 'Reviewed' : '+5 Review'}</button></span>)}</div>
      </section>
      <div className="feedback-notebook">
        {feedbacks.map(diary => <article className="notebook-card" key={diary.id}>
          <div className="diary-meta"><span>{dayjs(diary.createdAt).format('MMM D')}</span><strong>{diary.title}</strong></div>
          <dl>
            <dt>Original</dt><dd>{diary.content}</dd>
            {diary.corrected && <><dt>Corrected</dt><dd>{diary.corrected}</dd></>}
            {diary.natural && <><dt>Natural</dt><dd>{diary.natural}</dd></>}
            {diary.expression && <><dt>Useful expression</dt><dd>{diary.expression} <button onClick={() => saveExpression(diary.expression)}><IconBookmarkPlus size={16} /> Save</button><button onClick={() => reviewExpression(diary.expression)}>Review +5</button></dd></>}
            {diary.pattern && <><dt>Pattern</dt><dd>{diary.pattern} <button onClick={() => savePattern({ pattern: diary.pattern, meaning: diary.patternMeaning, example: diary.patternExample })}>Save pattern</button></dd></>}
            {diary.teacherComment && <><dt>Teacher comment</dt><dd>{diary.teacherComment}</dd></>}
          </dl>
        </article>)}
      </div>
      <section className="panel wide"><div className="panel-title"><h2>Typing 연결</h2><IconKeyboard size={20} /></div><p className="muted">현재 Writing Practice Bank는 기본 타자 문장만 제공해요. 나중에는 개인 문장 보관함 문장만 따로 연습할 수 있게 확장할 예정입니다.</p></section>
    </div>
  )
}
