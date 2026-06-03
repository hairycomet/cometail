import { Link } from 'react-router-dom'
import { IconFlame, IconPencilPlus, IconTrophy, IconChartBar, IconShieldCheck, IconGift, IconHanger, IconPlanet, IconSparkles, IconArrowRight, IconStarFilled } from '@tabler/icons-react'
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
  const canLaunch = user.level >= 10
  const planetUnlocked = user.level >= 20
  const nextUnlock = !canEnterUniverse ? { level: 5, label: 'Cometail Universe 입장' } : !canLaunch ? { level: 10, label: '내 커멧을 공용 우주에 띄우기' } : !planetUnlocked ? { level: 20, label: '나만의 행성 만들기' } : { level: 30, label: '행성 꾸미기' }

  return (
    <div className="home-grid v9-home-grid">
      <section className="hero-card universe-hero-card v9-home-hero">
        <div className="v9-hero-stars" aria-hidden="true" />
        <div className="hero-copy v9-home-copy">
          <p className="eyebrow">Level {user.level} · {user.streak} day streak</p>
          <h1>{lang === 'ko' ? `${user.cometName}가 오늘의 별빛을 기다리고 있어요.` : `${user.cometName} is waiting for today’s starlight.`}</h1>
          <p className="prompt-preview">Today’s spark: {currentPrompt}</p>
          <div className="v9-next-action">
            <IconStarFilled size={18} />
            <span>일기를 쓰면 +10 Starlight가 커멧 꼬리로 날아가요.</span>
          </div>
          <div className="hero-actions v9-hero-actions">
            <Link className="primary-button" to="/diary/new"><IconPencilPlus size={18} /> 오늘 일기 쓰기</Link>
            <Link className="secondary-button" to="/wardrobe"><IconHanger size={18} /> 꾸미기</Link>
            <Link className="secondary-button" to="/universe"><IconPlanet size={18} /> 우주 보기</Link>
          </div>
        </div>
        <div className="v9-avatar-stage">
          <div className="v9-stage-orbit" />
          <CometAvatar equipped={user.equipped} level={user.level} />
          <div className="v9-avatar-caption"><strong>{user.cometName}</strong><span>{user.points} Starlight</span></div>
        </div>
      </section>

      <section className="v9-quick-lift panel wide">
        <div className="v9-lift-copy">
          <p className="eyebrow">Today’s route</p>
          <h2>오늘은 한 문장만 남겨도 충분해요.</h2>
          <p>Cometail은 완벽한 영어보다 매일 다시 돌아오는 힘을 더 크게 봐요. 작은 기록이 별빛이 되고, 별빛이 너의 우주를 넓혀요.</p>
        </div>
        <Link className="primary-button" to="/diary/new">첫 문장 남기기 <IconArrowRight size={18} /></Link>
      </section>

      <div className="stats-row v9-stats-row">
        <StatCard label="Current streak" value={`${user.streak} days`} hint={`Best ${user.longestStreak} days`} icon={<IconFlame />} />
        <StatCard label="Starlight" value={user.points} hint={`${user.totalEarned || user.points} earned`} icon={<IconSparkles />} />
        <StatCard label="Open tasks" value={openHomework.length} hint="Teacher assignments" icon={<IconShieldCheck />} />
      </div>

      <section className="panel universe-status-panel v9-unlock-panel">
        <div className="panel-title"><h2>Next Universe Unlock</h2><IconPlanet size={20} /></div>
        <div className="v9-unlock-focus">
          <strong>Level {nextUnlock.level}</strong>
          <span>{nextUnlock.label}</span>
        </div>
        <div className="unlock-list">
          <p className={canEnterUniverse ? 'unlocked' : 'locked'}><strong>Level 5</strong><span>우주 입장 {canEnterUniverse ? '가능' : '잠김'}</span></p>
          <p className={canLaunch ? 'unlocked' : 'locked'}><strong>Level 10</strong><span>내 커멧 띄우기</span></p>
          <p className={planetUnlocked ? 'unlocked' : 'locked'}><strong>Level 20</strong><span>내 행성 만들기</span></p>
        </div>
        <p className="muted">Starlight는 상점뿐 아니라 공용 우주와 내 행성에도 투자할 수 있어요.</p>
      </section>

      <section className="panel v9-mission-panel">
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

      <section className="panel v9-quest-panel">
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

      <section className="panel wide v9-trail-panel">
        <div className="panel-title"><h2>Writing trail</h2><span>최근 35일 · 이번 주 {weeklyCount}회</span></div>
        <Heatmap diaries={diaries} />
      </section>

      <section className="panel v9-level-panel">
        <div className="panel-title"><h2>Comet tail progress</h2><span>{progress}/100</span></div>
        <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
        <p className="muted">100 Starlight를 얻을 때마다 레벨이 올라가고 꼬리가 더 풍성해져요.</p>
      </section>

      <section className="panel v9-ranking-panel">
        <div className="panel-title"><h2>Anonymous Ranking</h2><IconTrophy size={20} /></div>
        <ol className="leaderboard">
          {ranking.map((name, index) => <li key={name}><span>{index + 1}</span><strong>{index === 0 ? user.cometName : name}</strong><em>{690 - index * 86}✨</em></li>)}
        </ol>
        <p className="muted">랭킹은 일기 내용 없이 익명 캐릭터 중심으로만 보여줘요.</p>
      </section>
    </div>
  )
}
