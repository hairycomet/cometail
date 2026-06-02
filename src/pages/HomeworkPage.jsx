import { IconCheck, IconClockHour4 } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'

export default function HomeworkPage() {
  const { homework, submitHomework } = useAppStore()
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="eyebrow">Teacher Tasks</p><h1>숙제</h1><p>학생이 해야 할 일을 한눈에 보고 제출하면 포인트를 받는 구조입니다.</p></div></div>
      <div className="task-grid">
        {homework.map(task => (
          <article className={`task-card ${task.status}`} key={task.id}>
            <div className="task-top"><span>{task.status === 'submitted' ? <IconCheck size={18} /> : <IconClockHour4 size={18} />} {task.status}</span><strong>+{task.reward}pt</strong></div>
            <h2>{task.title}</h2>
            <p>{task.desc}</p>
            <small>Due {task.due}</small>
            {task.status !== 'submitted' && <button className="primary-button" onClick={() => submitHomework(task.id)}>제출 완료</button>}
          </article>
        ))}
      </div>
    </div>
  )
}
