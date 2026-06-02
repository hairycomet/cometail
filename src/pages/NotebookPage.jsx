import dayjs from 'dayjs'
import { IconBookmarkPlus } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'

export default function NotebookPage() {
  const { diaries, user, saveExpression } = useAppStore()
  const feedbacks = diaries.filter(diary => diary.feedback || diary.corrected || diary.natural || diary.expression)
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="eyebrow">Feedback Notebook</p><h1>피드백 보관함</h1><p>선생님 피드백이 한 번 보고 끝나지 않도록, 교정 문장과 자연스러운 표현을 복습하는 공간입니다.</p></div></div>
      <section className="panel wide">
        <div className="panel-title"><h2>Saved expressions</h2><span>{user.savedExpressions?.length || 0} expressions</span></div>
        <div className="expression-bank">{(user.savedExpressions || []).map(expression => <span key={expression}>{expression}</span>)}</div>
      </section>
      <div className="feedback-notebook">
        {feedbacks.map(diary => <article className="notebook-card" key={diary.id}>
          <div className="diary-meta"><span>{dayjs(diary.createdAt).format('MMM D')}</span><strong>{diary.title}</strong></div>
          <dl>
            <dt>Original</dt><dd>{diary.content}</dd>
            {diary.corrected && <><dt>Corrected</dt><dd>{diary.corrected}</dd></>}
            {diary.natural && <><dt>Natural</dt><dd>{diary.natural}</dd></>}
            {diary.expression && <><dt>Useful expression</dt><dd>{diary.expression} <button onClick={() => saveExpression(diary.expression)}><IconBookmarkPlus size={16} /> Save</button></dd></>}
            {diary.teacherComment && <><dt>Teacher comment</dt><dd>{diary.teacherComment}</dd></>}
          </dl>
        </article>)}
      </div>
    </div>
  )
}
