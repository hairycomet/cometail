import { useEffect, useMemo, useState } from 'react'
import { IconPlayerPlay, IconRefresh } from '@tabler/icons-react'
import { typingSentences } from '../data/content'

export default function TypingPage() {
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [start, setStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
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
    const wpm = Math.round((input.trim().split(/\s+/).filter(Boolean).length / minutes))
    return { correct, accuracy, wpm }
  }, [input, target, elapsed])

  const reset = () => { setInput(''); setStart(null); setElapsed(0) }
  const next = () => { setIndex((index + 1) % typingSentences.length); reset() }

  return (
    <div className="typing-page page-stack">
      <div className="page-header"><div><p className="eyebrow">Typing Practice</p><h1>영어 타자 연습</h1><p>문장 단위로 연습하면 속도뿐 아니라 자연스러운 영어 문장 감각도 같이 쌓입니다.</p></div></div>
      <section className="typing-card">
        <div className="typing-target">{target.split('').map((char, i) => <span key={`${char}-${i}`} className={input[i] == null ? '' : input[i] === char ? 'correct' : 'wrong'}>{char}</span>)}</div>
        <textarea value={input} onFocus={() => !start && setStart(Date.now())} onChange={e => setInput(e.target.value)} placeholder="Click here and start typing..." rows="5" />
        <div className="typing-actions"><button className="secondary-button" onClick={reset}><IconRefresh size={18} /> 다시</button><button className="primary-button" onClick={next}><IconPlayerPlay size={18} /> 다음 문장</button></div>
      </section>
      <div className="stats-row"><div className="stat-card"><p>WPM</p><strong>{stats.wpm}</strong></div><div className="stat-card"><p>Accuracy</p><strong>{stats.accuracy}%</strong></div><div className="stat-card"><p>Time</p><strong>{elapsed}s</strong></div></div>
    </div>
  )
}
