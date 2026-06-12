import { Link } from 'react-router-dom'
import { IconArrowRight, IconBook2, IconFlame, IconMessageHeart, IconNotebook, IconPencilHeart, IconPlanet, IconSparkles, IconStarFilled } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import Heatmap from '../components/Heatmap'
import { useAppStore } from '../store/useAppStore'
import { getWeeklyCount } from '../utils/stats'

export default function HomePage() {
  const { user, diaries, currentPrompt } = useAppStore()
  const totalEarned = Number(user.totalEarned || user.points || 0)
  const levelStart = Math.max(0, (user.level - 1) * 100)
  const xpInLevel = Math.max(0, totalEarned - levelStart)
  const xpNeeded = Math.max(0, user.level * 100 - totalEarned)
  const progress = Math.min(100, Math.round((xpInLevel / 100) * 100))
  const waitingFeedback = diaries.filter(diary => diary.status === 'waiting').length
  const feedbackReady = diaries.filter(diary => diary.feedback || diary.corrected || diary.natural || diary.expression).length
  const savedPatternCount = user.savedPatterns?.length || 0
  const weeklyCount = getWeeklyCount(diaries)
  const recentDiary = diaries[0]

  return (
    <div className="v14-home">
      <section className="v14-home-hero">
        <div className="v14-home-stars" aria-hidden="true" />
        <div className="v14-home-greeting">
          <p className="eyebrow">Private English Universe</p>
          <h1>오늘도 한 문장만<br />별빛으로 남겨볼까요?</h1>
          <p>완벽하지 않아도 괜찮아요. 매일 조금씩 쓰고, 피드백을 받고, 나만의 영어 우주를 키워가요.</p>
          <Link className="v14-main-cta" to="/diary/new">오늘 한 문장 남기기 <span>☄️</span></Link>
        </div>
        <div className="v14-comet-card">
          <CometAvatar equipped={user.equipped} level={user.level} />
          <div>
            <strong>{user.cometName}</strong>
            <span>Lv. {user.level} · {user.points} Starlight</span>
          </div>
        </div>
      </section>

      <section className="v14-stat-strip">
        <article><IconFlame size={19} /><strong>{user.streak}</strong><span>연속 기록</span></article>
        <article><IconSparkles size={19} /><strong>{user.points}</strong><span>별빛</span></article>
        <article><IconStarFilled size={19} /><strong>Lv. {user.level}</strong><span>레벨</span></article>
      </section>

      <section className="v14-level-card">
        <div>
          <p className="eyebrow">Growth</p>
          <h2>다음 레벨까지 {xpNeeded} XP</h2>
        </div>
        <div className="v14-level-track"><div style={{ width: `${progress}%` }} /></div>
        <p>{xpInLevel}/100 XP · 일기 하나가 오늘의 별빛이 돼요.</p>
      </section>

      <section className="v14-daily-card">
        <div className="v14-card-title">
          <IconPencilHeart size={22} />
          <div><h2>오늘의 질문</h2><p>{currentPrompt}</p></div>
        </div>
        <Link className="secondary-button" to="/diary/new">이 질문으로 쓰기 <IconArrowRight size={17} /></Link>
      </section>

      <section className="v14-action-list">
        <Link to="/diary" className="v14-action-row">
          <span><IconBook2 size={22} /></span>
          <div><strong>내 영어 기록</strong><small>{diaries.length ? `지금까지 ${diaries.length}개의 별빛을 남겼어요.` : '첫 영어 기록을 남겨보세요.'}</small></div>
          <IconArrowRight size={18} />
        </Link>
        <Link to="/notebook" className="v14-action-row">
          <span><IconNotebook size={22} /></span>
          <div><strong>문장 보관함</strong><small>{savedPatternCount ? `${savedPatternCount}개의 표현이 쌓였어요.` : '피드백에서 배운 표현이 여기에 쌓여요.'}</small></div>
          <IconArrowRight size={18} />
        </Link>
        <Link to="/universe" className="v14-action-row">
          <span><IconPlanet size={22} /></span>
          <div><strong>우주 산책</strong><small>초대받은 친구들의 행성과 공개 표현을 구경해요.</small></div>
          <IconArrowRight size={18} />
        </Link>
      </section>

      {(waitingFeedback > 0 || feedbackReady > 0) && (
        <section className="v14-feedback-card">
          <div className="v14-card-title">
            <IconMessageHeart size={22} />
            <div>
              <h2>{feedbackReady ? '새 피드백이 도착했어요' : '피드백을 기다리고 있어요'}</h2>
              <p>{feedbackReady ? '다듬어진 문장과 오늘의 표현을 확인해보세요.' : `${waitingFeedback}개의 기록이 별빛 피드백을 기다리고 있어요.`}</p>
            </div>
          </div>
          <Link className="primary-button" to="/diary">피드백 보기</Link>
        </section>
      )}

      {recentDiary && (
        <section className="v14-recent-card">
          <p className="eyebrow">Recent Starlight</p>
          <h2>{recentDiary.title}</h2>
          <p>{recentDiary.content}</p>
        </section>
      )}

      <section className="v14-trail-card">
        <div className="v14-card-title">
          <IconSparkles size={22} />
          <div><h2>이번 주 별빛</h2><p>최근 35일 · 이번 주 {weeklyCount}회 기록</p></div>
        </div>
        <Heatmap diaries={diaries} />
      </section>
    </div>
  )
}
