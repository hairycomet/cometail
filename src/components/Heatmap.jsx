import dayjs from 'dayjs'
import { getDiaryDates } from '../utils/stats'

export default function Heatmap({ diaries }) {
  const dates = getDiaryDates(diaries)
  const days = Array.from({ length: 35 }, (_, index) => dayjs().subtract(34 - index, 'day'))
  return (
    <div className="heatmap" aria-label="Diary heatmap">
      {days.map(day => {
        const key = day.format('YYYY-MM-DD')
        return <div key={key} className={dates.has(key) ? 'filled' : ''} title={key} />
      })}
    </div>
  )
}
