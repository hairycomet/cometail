import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { IconKeyboard, IconPlayerPlay, IconRefresh, IconSparkles } from '@tabler/icons-react'
import { typingSentences } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function TypingPage() {
  const { completeTypingPractice, user } = useAppStore()
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [start, setStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [finishedElapsed, setFinishedElapsed] = useState(null)
  const [saved, setSaved] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [corrections, setCorrections] = useState(0)
  const previousInput = useRef('')
  const target = typingSentences[index]
  const isFinished = input.trim() === target.trim()
  const todayTypingCount = (user.typingRecords || []).filter(record => record.completed && dayjs(record.createdAt).isSame(dayjs(), 'day')).length
  const nextReward = (todayTypingCount + 1) * 5

  useEffect(() => {
    if (!start || finishedElapsed != null) return
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 400)
    return () => clearInterval(timer)
  }, [start, finishedElapsed])

  useEffect(() => {
    if (isFinished && start && finishedElapsed == null) {
      setFinishedElapsed(Math.max(1, Math.floor((Date.now() - start) / 1000)))
    }
  }, [isFinished, start, finishedElapsed])

  const displaySeconds = finishedElapsed ?? elapsed
  const stats = useMemo(() => {
    const correct = input.split('').filter((char, i) => char === target[i]).length
    const typedCount = Math.max(1, input.length)
    const accuracy = Math.max(0, Math.round((1 - mistakes / typedCount) * 100))
    const minutes = Math.max(displaySeconds / 60, 1 / 60)
    const wpm = Math.round(input.trim().split(/\s+/).filter(Boolean).length / minutes)
    return { correct, accuracy, wpm, completed: isFinished }
  }, [input, target, displaySeconds, isFinished, mistakes])

  const reset = () => { setInput(''); setStart(null); setElapsed(0); setFinishedElapsed(null); setSaved(false); setMistakes(0); setCorrections(0); previousInput.current = '' }
  const next = () => { setIndex((index + 1) % typingSentences.length); reset() }
  const saveRecord = () => {
    if (!stats.completed || saved) return
    completeTypingPractice({ wpm: stats.wpm, accuracy: stats.accuracy, seconds: displaySeconds, completed: stats.completed, mistakes, corrections, sentence: target })
    setSaved(true)
  }

  const handleChange = event => {
    const value = event.target.value
    if (!start && value) setStart(Date.now())
    const prev = previousInput.current
    if (value.length < prev.length) setCorrections(count => count + (prev.length - value.length))
    if (value.length > prev.length) {
      const added = value.slice(prev.length)
      let newMistakes = 0
      for (let i = 0; i < added.length; i += 1) {
        const pos = prev.length + i
        if (added[i] !== target[pos]) newMistakes += 1
      }
      if (newMistakes) setMistakes(count => count + newMistakes)
    }
    previousInput.current = value
    setInput(value)
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter' && stats.completed) {
      event.preventDefault()
      saveRecord()
    }
  }

  return (
    <div className="typing-page page-stack v11-typing-page">
      <div className="page-header"><div><p className="eyebrow">Writing Practice Bank</p><h1>영어 타자 연습</h1><p>지금은 기본 타자 문장만 제공돼요. 나중에는 개인별 문장 보관함과 선생님 추천 문장으로 확장할 예정이에요.</p></div><div className="point-chip large"><IconSparkles size={18} /> {user.points} Starlight</div></div>
      <section className="typing-card upgraded-typing-card v11-typing-card">
        <div className="typing-bank-note"><IconKeyboard size={18} /><span>기본 타자 문장 · 오늘 {todayTypingCount}번 완료 · 다음 보상 +{nextReward} Starlight</span></div>
        <div className="typing-target">{target.split('').map((char, i) => <span key={`${char}-${i}`} className={input[i] == null ? '' : input[i] === char ? 'correct' : 'wrong'}>{char}</span>)}</div>
        <textarea value={input} onFocus={() => !start && setStart(Date.now())} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="문장을 입력하세요. 다 입력한 뒤 Enter를 누르면 완료돼요." rows="5" />
        {stats.completed && !saved && <div className="typing-complete-banner"><strong>문장 완료!</strong><span>시간과 WPM이 고정됐어요. Enter 또는 완료 버튼으로 저장하세요.</span></div>}
        <div className="typing-actions"><button className="secondary-button" onClick={reset}><IconRefresh size={18} /> 다시</button><button className="secondary-button" onClick={next}><IconPlayerPlay size={18} /> 다음 문장</button><button className="primary-button" disabled={!stats.completed || saved} onClick={saveRecord}><IconSparkles size={18} /> 완료하고 +{nextReward}</button></div>
      </section>
      <div className="stats-row"><div className="stat-card"><p>WPM</p><strong>{stats.wpm}</strong></div><div className="stat-card"><p>Accuracy</p><strong>{stats.accuracy}%</strong><span>{mistakes} mistakes</span></div><div className="stat-card"><p>Time</p><strong>{displaySeconds}s</strong></div><div className="stat-card"><p>Corrections</p><strong>{corrections}</strong></div></div>
      <section className="panel wide"><div className="panel-title"><h2>Recent records</h2><span>{user.typingRecords?.length || 0}</span></div><div className="record-row">{(user.typingRecords || []).slice(0, 5).map(record => <span key={record.id}>⌨️ {record.wpm} WPM · {record.accuracy}% · +{record.reward || 0}</span>)}</div></section>
    </div>
  )
}
