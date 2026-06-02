import dayjs from 'dayjs'

export const getDiaryDates = diaries => new Set(diaries.map(diary => dayjs(diary.createdAt).format('YYYY-MM-DD')))

export const getWeeklyCount = diaries => diaries.filter(diary => dayjs(diary.createdAt).isAfter(dayjs().subtract(7, 'day'))).length

export const getWords = text => text.trim().split(/\s+/).filter(Boolean)

export const scoreWriting = text => {
  const words = getWords(text)
  const lengthScore = Math.min(100, Math.round((words.length / 120) * 100))
  const sentenceCount = text.split(/[.!?]/).filter(sentence => sentence.trim().length > 2).length
  const variety = new Set(words.map(word => word.toLowerCase().replace(/[^a-z]/g, ''))).size
  return {
    words: words.length,
    sentences: sentenceCount,
    variety,
    readiness: Math.min(100, Math.round((lengthScore * 0.65) + Math.min(35, variety / 2))),
  }
}
