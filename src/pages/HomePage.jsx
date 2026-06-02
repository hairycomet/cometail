import { Link } from 'react-router-dom'
import { IconFlame, IconPencilPlus, IconTrophy, IconChartBar, IconShieldCheck } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import StatCard from '../components/StatCard'
import Heatmap from '../components/Heatmap'
import { useAppStore } from '../store/useAppStore'
import { getWeeklyCount } from '../utils/stats'

export default function HomePage() {
  const { user, diaries, homework, currentPrompt } = useAppStore()
  const openHomework = homework.filter(item => item.status === 'open')
  const weeklyCount = getWeeklyCount(diaries)
  const progress = Math.min(100, user.points % 100)
  const ranking = [...new Set([user.nickname, 'TOEFL Star', 'IELTS Learner', 'Young Writer'])]

  return (
    <div className="home-grid">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Level {user.level} Comet Writer</p>
          <h1>{user.nickname}님, 오늘도 영어 꼬리를 하나 남겨볼까요?</h1>
          <p className="prompt-preview">Today’s prompt: {currentPrompt}</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/diary/new"><IconPencilPlus size={18} /> 일기 쓰기</Link>
            <Link className="secondary-button" to="/homework">숙제 확인</Link>
          </div>
        </div>
        <CometAvatar equipped={user.equipped} />
      </section>

      <div className="stats-row">
        <StatCard label="Current streak" value={`${user.streak} days`} hint={`Best ${user.longestStreak} days`} icon={<IconFlame />} />
        <StatCard label="This week" value={`${weeklyCount} diaries`} hint="Daily writing" icon={<IconChartBar />} />
        <StatCard label="Open tasks" value={openHomework.length} hint="Teacher assignments" icon={<IconShieldCheck />} />
      </div>

      <section className="panel wide">
        <div className="panel-title"><h2>Writing trail</h2><span>최근 35일</span></div>
        <Heatmap diaries={diaries} />
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Level progress</h2><span>{progress}/100</span></div>
        <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
        <p className="muted">100pt마다 레벨이 올라가요. 일기 10pt, 숙제 제출 15pt.</p>
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Leaderboard</h2><IconTrophy size={20} /></div>
        <ol className="leaderboard">
          {ranking.map((name, index) => <li key={name}><span>{index + 1}</span><strong>{name}</strong><em>{390 - index * 46}pt</em></li>)}
        </ol>
      </section>
    </div>
  )
}
