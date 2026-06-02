import { useEffect, useMemo, useState } from 'react'
import { IconPlayerPlay, IconRefresh, IconSparkles } from '@tabler/icons-react'
import { typingSentences } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function TypingPage() {
  const { completeTypingPractice, user } = useAppStore()
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [start, setStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [saved, setSaved] = useState(false)
  const target = typingSentences[index]

  useEffect(() => {
    if (!start) return
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 500)
    return () => clearInterval(timer)
  }, [start])

  const stats = useMemo(() => {
    const correct = input.split('').filter((char, i) => char === target[i]).length
    const accuracy = input.length ? Math.round((correct / input.length) * 100) : 100
    const minutes = Math.max(elapsed / 60, 1 / 60)
    const wpm = Math.round(input.trim().split(/\s+/).filter(Boolean).length / minutes)
    const completed = input.trim() === target.trim()
    return { correct, accuracy, wpm, completed }
  }, [input, target, elapsed])

  const reset = () => { setInput(''); setStart(null); setElapsed(0); setSaved(false) }
  const next = () => { setIndex((index + 1) % typingSentences.length); reset() }
  const saveRecord = () => {
    completeTypingPractice({ wpm: stats.wpm, accuracy: stats.accuracy, seconds: elapsed, completed: stats.completed })
    setSaved(true)
  }

  return (
    <div className="typing-page page-stack">
      <div className="page-header"><div><p className="eyebrow">Typing Practice</p><h1>영어 타자 연습</h1><p>짧게 들어와도 별빛을 얻을 수 있는 미니 루프예요. 완료 기록은 성장 리포트에 쌓입니다.</p></div><div className="point-chip large"><IconSparkles size={18} /> {user.points} Starlight</div></div>
      <section className="typing-card upgraded-typing-card">
        <div className="typing-target">{target.split('').map((char, i) => <span key={`${char}-${i}`} className={input[i] == null ? '' : input[i] === char ? 'correct' : 'wrong'}>{char}</span>)}</div>
        <textarea value={input} onFocus={() => !start && setStart(Date.now())} onChange={e => setInput(e.target.value)} placeholder="Tap here and start typing..." rows="5" />
        <div className="typing-actions"><button className="secondary-button" onClick={reset}><IconRefresh size={18} /> 다시</button><button className="secondary-button" onClick={next}><IconPlayerPlay size={18} /> 다음 문장</button><button className="primary-button" disabled={!stats.completed || saved} onClick={saveRecord}><IconSparkles size={18} /> 완료하고 +5</button></div>
      </section>
      <div className="stats-row"><div className="stat-card"><p>WPM</p><strong>{stats.wpm}</strong></div><div className="stat-card"><p>Accuracy</p><strong>{stats.accuracy}%</strong></div><div className="stat-card"><p>Time</p><strong>{elapsed}s</strong></div></div>
      <section className="panel wide"><div className="panel-title"><h2>Recent records</h2><span>{user.typingRecords?.length || 0}</span></div><div className="record-row">{(user.typingRecords || []).slice(0, 5).map(record => <span key={record.id}>⌨️ {record.wpm} WPM · {record.accuracy}%</span>)}</div></section>
    </div>
  )
}
