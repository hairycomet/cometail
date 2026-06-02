import { Link } from 'react-router-dom'
import { IconFlame, IconPencilPlus, IconTrophy, IconChartBar, IconShieldCheck, IconGift } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import StatCard from '../components/StatCard'
import Heatmap from '../components/Heatmap'
import { useAppStore } from '../store/useAppStore'
import { getWeeklyCount } from '../utils/stats'

export default function HomePage() {
  const { user, diaries, homework, currentPrompt, missions, quests, completeMission, completeQuest } = useAppStore()
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

      <section className="panel">
        <div className="panel-title"><h2>Today’s missions</h2><span>{user.completedMissions?.length || 0}/{missions.length}</span></div>
        <div className="mission-list">
          {missions.map(mission => {
            const done = user.completedMissions?.includes(mission.id)
            return <button key={mission.id} className={`mission-row ${done ? 'done' : ''}`} onClick={() => completeMission(mission.id)} disabled={done}>
              <span><strong>{mission.title}</strong><small>{mission.type}</small></span><em>{done ? 'Done' : `+${mission.reward}pt`}</em>
            </button>
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Weekly quests</h2><IconGift size={20} /></div>
        <div className="quest-list">
          {quests.map(quest => {
            const done = user.completedQuests?.includes(quest.id)
            const width = Math.min(100, Math.round((quest.progress / quest.goal) * 100))
            return <div className="quest-card" key={quest.id}>
              <div><strong>{quest.title}</strong><span>{quest.progress}/{quest.goal}</span></div>
              <div className="progress-track"><div style={{ width: `${width}%` }} /></div>
              <button className="secondary-button" disabled={done || quest.progress < quest.goal} onClick={() => completeQuest(quest.id)}>{done ? '완료' : `보상 ${quest.reward}pt`}</button>
            </div>
          })}
        </div>
      </section>

      <section className="panel wide">
        <div className="panel-title"><h2>Writing trail</h2><span>최근 35일</span></div>
        <Heatmap diaries={diaries} />
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Level progress</h2><span>{progress}/100</span></div>
        <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
        <p className="muted">100pt마다 레벨이 올라가요. 일기, 미션, 숙제로 캐릭터를 키워요.</p>
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Leaderboard</h2><IconTrophy size={20} /></div>
        <ol className="leaderboard">
          {ranking.map((name, index) => <li key={name}><span>{index + 1}</span><strong>{name}</strong><em>{690 - index * 86}pt</em></li>)}
        </ol>
      </section>
    </div>
  )
}
