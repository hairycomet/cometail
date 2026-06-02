import { useState } from 'react'
import dayjs from 'dayjs'
import { IconMessageCircle2, IconPlus } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'

export default function AdminPage() {
  const { diaries, students, homework, addFeedback, addHomework } = useAppStore()
  const [feedback, setFeedback] = useState({})
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')

  const saveTask = event => {
    event.preventDefault()
    if (!taskTitle.trim()) return
    addHomework({ title: taskTitle, desc: taskDesc, due: dayjs().add(3, 'day').format('YYYY-MM-DD') })
    setTaskTitle('')
    setTaskDesc('')
  }

  return (
    <div className="admin-page page-stack">
      <div className="page-header"><div><p className="eyebrow">Teacher Dashboard</p><h1>관리자 대시보드</h1><p>소수 학생을 관리하는 영어 선생님용 화면입니다. 피드백, 숙제 등록, 학생 현황을 빠르게 처리합니다.</p></div></div>
      <div className="stats-row"><div className="stat-card"><p>Students</p><strong>{students.length}</strong></div><div className="stat-card"><p>Diaries</p><strong>{diaries.length}</strong></div><div className="stat-card"><p>Open tasks</p><strong>{homework.filter(h => h.status === 'open').length}</strong></div></div>
      <section className="admin-grid">
        <div className="panel"><div className="panel-title"><h2>Students</h2><span>Active group</span></div><div className="student-list">{students.map(student => <div key={student.id} className="student-row"><strong>{student.name}</strong><span>{student.streak}🔥</span><span>{student.points}pt</span><small>{student.lastActive}</small></div>)}</div></div>
        <form className="panel" onSubmit={saveTask}><div className="panel-title"><h2>New homework</h2><IconPlus size={20} /></div><input placeholder="Homework title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} /><textarea placeholder="Description" rows="4" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} /><button className="primary-button">숙제 등록</button></form>
      </section>
      <section className="panel wide"><div className="panel-title"><h2>Diary feedback queue</h2><span>{diaries.filter(d => !d.feedback).length} waiting</span></div><div className="feedback-list">{diaries.map(diary => <article key={diary.id} className="feedback-item"><div><strong>{diary.nickname}</strong><span>{dayjs(diary.createdAt).format('MMM D')}</span></div><h3>{diary.title}</h3><p>{diary.content}</p><textarea rows="3" placeholder="Write teacher feedback..." value={feedback[diary.id] ?? diary.feedback} onChange={e => setFeedback({ ...feedback, [diary.id]: e.target.value })} /><button className="secondary-button" onClick={() => addFeedback(diary.id, feedback[diary.id] ?? diary.feedback)}><IconMessageCircle2 size={18} /> 피드백 저장</button></article>)}</div></section>
    </div>
  )
}
