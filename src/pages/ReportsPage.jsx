import { IconChartBar, IconClipboardCheck, IconKeyboard, IconMessageCircle2, IconPencilHeart, IconSparkles } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { getWeeklyCount } from '../utils/stats'

function Metric({ icon, label, value, hint }) {
  return <article className="report-metric">{icon}<div><strong>{value}</strong><span>{label}</span><small>{hint}</small></div></article>
}

export default function ReportsPage() {
  const { user, diaries, homework } = useAppStore()
  const feedbackCount = diaries.filter(diary => diary.feedback || diary.corrected || diary.natural).length
  const reviewedCount = user.reviewedExpressions?.length || 0
  const submitted = homework.filter(task => ['submitted', 'reviewed'].includes(task.status)).length
  const open = homework.filter(task => task.status === 'open').length
  const monthlyWords = diaries.reduce((sum, diary) => sum + diary.content.split(/\s+/).filter(Boolean).length, 0)
  const bestWpm = Math.max(0, ...(user.typingRecords || []).map(record => record.wpm || 0))
  const weeklyDiaryCount = getWeeklyCount(diaries)

  return (
    <div className="page-stack reports-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Growth Report</p>
          <h1>성장 리포트</h1>
          <p>학생 테스트 단계에서는 데모 데이터로 보여주고, Firebase 연결 후에는 실제 월간 기록으로 바뀌는 구조예요.</p>
        </div>
        <div className="point-chip large"><IconSparkles size={18} /> {user.totalEarned || user.points} earned</div>
      </div>

      <section className="report-hero panel wide">
        <div>
          <p className="eyebrow">This month</p>
          <h2>Every day expands your universe.</h2>
          <p>일기, 피드백 복습, 숙제, 타자 연습이 모두 별빛 기록으로 쌓여요.</p>
        </div>
        <div className="report-ring"><strong>{user.level}</strong><span>Level</span></div>
      </section>

      <section className="report-grid">
        <Metric icon={<IconPencilHeart />} label="Weekly diaries" value={weeklyDiaryCount} hint="이번 주 작성한 일기" />
        <Metric icon={<IconMessageCircle2 />} label="Feedback received" value={feedbackCount} hint="선생님 피드백 누적" />
        <Metric icon={<IconClipboardCheck />} label="Tasks submitted" value={`${submitted}/${homework.length}`} hint={`${open}개 진행 중`} />
        <Metric icon={<IconKeyboard />} label="Best WPM" value={bestWpm || 'Ready'} hint="타자 연습 최고 기록" />
        <Metric icon={<IconChartBar />} label="Words written" value={monthlyWords} hint="샘플 월간 작성 단어" />
        <Metric icon={<IconSparkles />} label="Reviewed expressions" value={reviewedCount} hint="복습 완료한 표현" />
      </section>

      <section className="panel wide beta-checklist">
        <div className="panel-title"><h2>학생 테스트 체크리스트</h2><span>Beta ready flow</span></div>
        <div className="checklist-grid">
          {['초대코드로 가입하기', '온보딩 끝까지 보기', '첫 일기 작성하기', 'Wardrobe에서 아이템 장착하기', 'Universe 탭 구경하기', 'Notebook에서 피드백 복습하기'].map(item => <div key={item}>✓ {item}</div>)}
        </div>
      </section>
    </div>
  )
}
