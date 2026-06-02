import { Link } from 'react-router-dom'
import { IconFlame, IconPencilPlus, IconTrophy, IconChartBar, IconShieldCheck, IconGift, IconHanger, IconPlanet, IconSparkles } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import StatCard from '../components/StatCard'
import Heatmap from '../components/Heatmap'
import { useAppStore } from '../store/useAppStore'
import { getWeeklyCount } from '../utils/stats'

export default function HomePage() {
  const { user, diaries, homework, currentPrompt, missions, quests, completeMission, completeQuest, getLanguage } = useAppStore()
  const lang = getLanguage()
  const openHomework = homework.filter(item => item.status === 'open')
  const weeklyCount = getWeeklyCount(diaries)
  const progress = Math.min(100, (user.totalEarned || user.points) % 100)
  const ranking = [...new Set([user.nickname, 'TOEFL Star', 'IELTS Learner', 'Young Writer'])]
  const canEnterUniverse = user.level >= 5
  const planetUnlocked = user.level >= 20

  return (
    <div className="home-grid">
      <section className="hero-card universe-hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Level {user.level} Comet Writer</p>
          <h1>{lang === 'ko' ? `${user.cometName}와 오늘의 별빛을 모아볼까요?` : `Let’s collect today’s starlight with ${user.cometName}.`}</h1>
          <p className="prompt-preview">Today’s prompt: {currentPrompt}</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/diary/new"><IconPencilPlus size={18} /> {lang === 'ko' ? '일기 쓰기' : 'Write Diary'}</Link>
            <Link className="secondary-button" to="/wardrobe"><IconHanger size={18} /> 내 캐릭터 꾸미기</Link>
            <Link className="secondary-button" to="/universe"><IconPlanet size={18} /> Universe</Link>
          </div>
        </div>
        <CometAvatar equipped={user.equipped} level={user.level} />
      </section>

      <div className="stats-row">
        <StatCard label="Current streak" value={`${user.streak} days`} hint={`Best ${user.longestStreak} days`} icon={<IconFlame />} />
        <StatCard label="Starlight" value={user.points} hint={`${user.totalEarned || user.points} earned`} icon={<IconSparkles />} />
        <StatCard label="Open tasks" value={openHomework.length} hint="Teacher assignments" icon={<IconShieldCheck />} />
      </div>

      <section className="panel universe-status-panel">
        <div className="panel-title"><h2>Universe Status</h2><IconPlanet size={20} /></div>
        <div className="unlock-list">
          <p className={canEnterUniverse ? 'unlocked' : 'locked'}><strong>Level 5</strong><span>우주 입장 {canEnterUniverse ? '가능' : '잠김'}</span></p>
          <p className={user.level >= 10 ? 'unlocked' : 'locked'}><strong>Level 10</strong><span>내 커멧 띄우기</span></p>
          <p className={planetUnlocked ? 'unlocked' : 'locked'}><strong>Level 20</strong><span>내 행성 만들기</span></p>
        </div>
        <p className="muted">포인트가 남으면 Universe 탭에서 우주와 행성에 투자할 수 있어요.</p>
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Today’s missions</h2><span>{user.completedMissions?.length || 0}/{missions.length}</span></div>
        <div className="mission-list">
          {missions.map(mission => {
            const done = user.completedMissions?.includes(mission.id)
            return <button key={mission.id} className={`mission-row ${done ? 'done' : ''}`} onClick={() => completeMission(mission.id)} disabled={done}>
              <span><strong>{lang === 'ko' ? mission.title : mission.titleEn}</strong><small>{mission.type}</small></span><em>{done ? 'Done' : `+${mission.reward} Starlight`}</em>
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
              <button className="secondary-button" disabled={done || quest.progress < quest.goal} onClick={() => completeQuest(quest.id)}>{done ? '완료' : `보상 ${quest.reward} Starlight`}</button>
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
        <p className="muted">100 Starlight를 얻을 때마다 레벨이 올라가고 꼬리가 더 풍성해져요.</p>
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Anonymous Ranking</h2><IconTrophy size={20} /></div>
        <ol className="leaderboard">
          {ranking.map((name, index) => <li key={name}><span>{index + 1}</span><strong>{index === 0 ? user.cometName : name}</strong><em>{690 - index * 86}✨</em></li>)}
        </ol>
        <p className="muted">랭킹은 일기 내용 없이 익명 캐릭터 중심으로만 보여주는 방향이 좋아요.</p>
      </section>
    </div>
  )
}
