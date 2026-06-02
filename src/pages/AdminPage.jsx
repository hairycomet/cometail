import { useState } from 'react'
import dayjs from 'dayjs'
import { IconGift, IconMessageCircle2, IconPlus } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { shopItems } from '../data/content'

export default function AdminPage() {
  const { diaries, students, homework, addFeedback, addHomework, teacherGift } = useAppStore()
  const [feedback, setFeedback] = useState({})
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [giftItem, setGiftItem] = useState('best_writer_badge')
  const [giftPoints, setGiftPoints] = useState(30)

  const saveTask = event => {
    event.preventDefault()
    if (!taskTitle.trim()) return
    addHomework({ title: taskTitle, desc: taskDesc, due: dayjs().add(3, 'day').format('YYYY-MM-DD') })
    setTaskTitle('')
    setTaskDesc('')
  }

  const updateFeedback = (id, key, value) => setFeedback(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: value } }))
  const saveFeedback = diary => {
    addFeedback(diary.id, {
      feedback: feedback[diary.id]?.feedback ?? diary.feedback,
      corrected: feedback[diary.id]?.corrected ?? diary.corrected,
      natural: feedback[diary.id]?.natural ?? diary.natural,
      expression: feedback[diary.id]?.expression ?? diary.expression,
      teacherComment: feedback[diary.id]?.teacherComment ?? diary.teacherComment,
    })
  }

  return (
    <div className="admin-page page-stack">
      <div className="page-header"><div><p className="eyebrow">Teacher Dashboard</p><h1>관리자 대시보드</h1><p>피드백, 숙제 등록, 학생 현황, 선생님 선물까지 빠르게 처리합니다.</p></div></div>
      <div className="stats-row"><div className="stat-card"><p>Students</p><strong>{students.length}</strong></div><div className="stat-card"><p>Waiting feedback</p><strong>{diaries.filter(d => !d.feedback).length}</strong></div><div className="stat-card"><p>Open tasks</p><strong>{homework.filter(h => h.status === 'open').length}</strong></div></div>
      <section className="admin-grid">
        <div className="panel"><div className="panel-title"><h2>Students</h2><span>Activity risk</span></div><div className="student-list">{students.map(student => <div key={student.id} className={`student-row risk-${student.risk?.toLowerCase().replaceAll(' ', '-')}`}><strong>{student.name}</strong><span>{student.streak}🔥</span><span>{student.points}pt</span><small>{student.risk}</small></div>)}</div></div>
        <form className="panel" onSubmit={saveTask}><div className="panel-title"><h2>New homework</h2><IconPlus size={20} /></div><input placeholder="Homework title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} /><textarea placeholder="Description" rows="4" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} /><button className="primary-button">숙제 등록</button></form>
        <section className="panel"><div className="panel-title"><h2>Teacher gift</h2><IconGift size={20} /></div><label>Special item<select value={giftItem} onChange={e => setGiftItem(e.target.value)}>{shopItems.filter(item => item.type !== 'Gift Box').map(item => <option value={item.id} key={item.id}>{item.emoji} {item.name}</option>)}</select></label><label>Bonus points<input type="number" value={giftPoints} onChange={e => setGiftPoints(e.target.value)} /></label><button className="secondary-button" onClick={() => teacherGift({ itemId: giftItem, points: giftPoints })}>선물 지급</button><p className="muted">실제 운영에서는 학생 선택 드롭다운을 붙이면 됩니다.</p></section>
        <section className="panel"><div className="panel-title"><h2>Quick insights</h2><span>Today</span></div><div className="insight-list"><p>피드백 대기 일기 {diaries.filter(d => !d.feedback).length}개</p><p>최근 활동 위험 학생 {students.filter(s => s.risk === 'At risk').length}명</p><p>오늘 등록된 숙제 {homework.filter(h => h.status === 'open').length}개</p></div></section>
      </section>
      <section className="panel wide"><div className="panel-title"><h2>Diary feedback queue</h2><span>{diaries.filter(d => !d.feedback).length} waiting</span></div><div className="feedback-list">{diaries.map(diary => <article key={diary.id} className="feedback-item"><div><strong>{diary.nickname}</strong><span>{dayjs(diary.createdAt).format('MMM D')}</span></div><h3>{diary.title}</h3><p>{diary.content}</p><textarea rows="2" placeholder="Short teacher feedback" defaultValue={diary.feedback} onChange={e => updateFeedback(diary.id, 'feedback', e.target.value)} /><textarea rows="2" placeholder="Grammatically corrected version" defaultValue={diary.corrected} onChange={e => updateFeedback(diary.id, 'corrected', e.target.value)} /><textarea rows="2" placeholder="Natural expression" defaultValue={diary.natural} onChange={e => updateFeedback(diary.id, 'natural', e.target.value)} /><input placeholder="Useful expression to memorize" defaultValue={diary.expression} onChange={e => updateFeedback(diary.id, 'expression', e.target.value)} /><input placeholder="Teacher comment" defaultValue={diary.teacherComment} onChange={e => updateFeedback(diary.id, 'teacherComment', e.target.value)} /><button className="secondary-button" onClick={() => saveFeedback(diary)}><IconMessageCircle2 size={18} /> 피드백 저장</button></article>)}</div></section>
    </div>
  )
}
