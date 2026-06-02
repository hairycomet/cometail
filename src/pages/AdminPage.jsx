import { useState } from 'react'
import dayjs from 'dayjs'
import { IconGift, IconKey, IconMessageCircle2, IconPlus } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { shopItems } from '../data/content'

export default function AdminPage() {
  const { diaries, students, homework, inviteCodes, addFeedback, addHomework, teacherGift, createAdminInviteCode } = useAppStore()
  const [feedback, setFeedback] = useState({})
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [giftItem, setGiftItem] = useState('best_writer_badge')
  const [giftPoints, setGiftPoints] = useState(30)
  const [inviteCode, setInviteCode] = useState('')
  const [inviteLabel, setInviteLabel] = useState('')
  const [inviteMax, setInviteMax] = useState(1)

  const saveTask = event => {
    event.preventDefault()
    if (!taskTitle.trim()) return
    addHomework({ title: taskTitle, desc: taskDesc, due: dayjs().add(3, 'day').format('YYYY-MM-DD') })
    setTaskTitle('')
    setTaskDesc('')
  }
  const saveInvite = event => {
    event.preventDefault()
    createAdminInviteCode({ code: inviteCode, label: inviteLabel, maxUses: inviteMax })
    setInviteCode('')
    setInviteLabel('')
    setInviteMax(1)
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
      <div className="page-header"><div><p className="eyebrow">Teacher Dashboard</p><h1>관리자 대시보드</h1><p>관리자 화면은 지정된 선생님 계정에서만 보이고, 학생에게는 관리자 힌트가 절대 노출되지 않습니다.</p></div></div>
      <div className="stats-row"><div className="stat-card"><p>Students</p><strong>{students.length}</strong></div><div className="stat-card"><p>Waiting feedback</p><strong>{diaries.filter(d => !d.feedback).length}</strong></div><div className="stat-card"><p>Invite codes</p><strong>{inviteCodes.length}</strong></div></div>
      <section className="admin-grid">
        <div className="panel"><div className="panel-title"><h2>Students</h2><span>Activity risk</span></div><div className="student-list">{students.map(student => <div key={student.id} className={`student-row risk-${student.risk?.toLowerCase().replaceAll(' ', '-')}`}><strong>{student.name}</strong><span>{student.streak}🔥</span><span>{student.points}✨</span><small>{student.risk}</small></div>)}</div></div>
        <form className="panel" onSubmit={saveTask}><div className="panel-title"><h2>New homework</h2><IconPlus size={20} /></div><input placeholder="Homework title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} /><textarea placeholder="Description" rows="4" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} /><button className="primary-button">숙제 등록</button></form>
        <form className="panel" onSubmit={saveInvite}><div className="panel-title"><h2>참여코드 생성</h2><IconKey size={20} /></div><input placeholder="예: COMET-JUNE" value={inviteCode} onChange={e => setInviteCode(e.target.value)} /><input placeholder="코드 설명" value={inviteLabel} onChange={e => setInviteLabel(e.target.value)} /><label>사용 가능 횟수<input type="number" value={inviteMax} min="1" onChange={e => setInviteMax(e.target.value)} /></label><button className="primary-button">참여코드 만들기</button></form>
        <section className="panel"><div className="panel-title"><h2>Teacher gift</h2><IconGift size={20} /></div><label>Special item<select value={giftItem} onChange={e => setGiftItem(e.target.value)}>{shopItems.filter(item => item.type !== 'Gift Box').map(item => <option value={item.id} key={item.id}>{item.emoji} {item.name}</option>)}</select></label><label>Bonus Starlight<input type="number" value={giftPoints} onChange={e => setGiftPoints(e.target.value)} /></label><button className="secondary-button" onClick={() => teacherGift({ itemId: giftItem, points: giftPoints })}>선물 지급</button><p className="muted">실제 운영에서는 학생 선택 드롭다운과 Firestore 저장을 붙이면 됩니다.</p></section>
      </section>
      <section className="panel wide"><div className="panel-title"><h2>Invite code status</h2><span>Private community gate</span></div><div className="invite-code-table">{inviteCodes.map(record => <div key={record.code}><strong>{record.code}</strong><span>{record.label}</span><em>{record.used}/{record.maxUses}</em></div>)}</div></section>
      <section className="panel wide"><div className="panel-title"><h2>Diary feedback queue</h2><span>{diaries.filter(d => !d.feedback).length} waiting</span></div><div className="feedback-list">{diaries.map(diary => <article key={diary.id} className="feedback-item"><div><strong>{diary.nickname}</strong><span>{dayjs(diary.createdAt).format('MMM D')} · {diary.visibility}</span></div><h3>{diary.title}</h3><p>{diary.content}</p><textarea rows="2" placeholder="Short teacher feedback" defaultValue={diary.feedback} onChange={e => updateFeedback(diary.id, 'feedback', e.target.value)} /><textarea rows="2" placeholder="Grammatically corrected version" defaultValue={diary.corrected} onChange={e => updateFeedback(diary.id, 'corrected', e.target.value)} /><textarea rows="2" placeholder="Natural expression" defaultValue={diary.natural} onChange={e => updateFeedback(diary.id, 'natural', e.target.value)} /><input placeholder="Useful expression to memorize" defaultValue={diary.expression} onChange={e => updateFeedback(diary.id, 'expression', e.target.value)} /><input placeholder="Teacher comment" defaultValue={diary.teacherComment} onChange={e => updateFeedback(diary.id, 'teacherComment', e.target.value)} /><button className="secondary-button" onClick={() => saveFeedback(diary)}><IconMessageCircle2 size={18} /> 피드백 저장</button></article>)}</div></section>
    </div>
  )
}
