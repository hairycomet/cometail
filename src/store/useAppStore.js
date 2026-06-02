import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { diaryPrompts, sampleDiaries, sampleHomework, sampleStudents, sampleUser, shopItems } from '../data/content'

const calcLevel = points => Math.max(1, Math.floor(points / 100) + 1)

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: sampleUser,
      diaries: sampleDiaries,
      homework: sampleHomework,
      students: sampleStudents,
      theme: 'light',
      isAuthed: true,
      currentPrompt: diaryPrompts[0],
      login: ({ email }) => set({ isAuthed: true, user: { ...get().user, email } }),
      logout: () => set({ isAuthed: false }),
      completeOnboarding: data => set(state => ({ user: { ...state.user, ...data } })),
      toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      rotatePrompt: () => {
        const current = get().currentPrompt
        const index = diaryPrompts.indexOf(current)
        set({ currentPrompt: diaryPrompts[(index + 1) % diaryPrompts.length] })
      },
      addDiary: ({ title, content }) => {
        const entry = {
          id: crypto.randomUUID(),
          userId: get().user.uid,
          nickname: get().user.nickname,
          title: title || 'Untitled Diary',
          content,
          feedback: '',
          createdAt: dayjs().toISOString(),
          points: 10,
        }
        set(state => {
          const newPoints = state.user.points + 10
          return {
            diaries: [entry, ...state.diaries],
            user: { ...state.user, points: newPoints, level: calcLevel(newPoints), streak: state.user.streak + 1, longestStreak: Math.max(state.user.longestStreak, state.user.streak + 1) },
          }
        })
        toast.success('+10pt 일기 저장 완료')
      },
      submitHomework: id => {
        set(state => {
          const newPoints = state.user.points + 15
          return {
            homework: state.homework.map(item => item.id === id ? { ...item, status: 'submitted' } : item),
            user: { ...state.user, points: newPoints, level: calcLevel(newPoints) },
          }
        })
        toast.success('+15pt 숙제 제출 완료')
      },
      buyItem: itemId => {
        const item = shopItems.find(product => product.id === itemId)
        const { user } = get()
        if (!item) return
        if (user.owned?.includes(itemId)) {
          toast('이미 가지고 있어요')
          return
        }
        if (user.points < item.price) {
          toast.error('포인트가 부족해요')
          return
        }
        set(state => ({
          user: {
            ...state.user,
            points: state.user.points - item.price,
            owned: [...(state.user.owned || []), itemId],
          },
        }))
        toast.success(`${item.name} 구매 완료`)
      },
      equipItem: itemId => {
        set(state => ({ user: { ...state.user, equipped: [...new Set([...(state.user.equipped || []), itemId])] } }))
        toast.success('캐릭터에 장착했어요')
      },
      addFeedback: (diaryId, feedback) => {
        set(state => ({ diaries: state.diaries.map(diary => diary.id === diaryId ? { ...diary, feedback } : diary) }))
        toast.success('피드백 저장 완료')
      },
      addHomework: homework => {
        set(state => ({ homework: [{ id: crypto.randomUUID(), status: 'open', reward: 15, ...homework }, ...state.homework] }))
        toast.success('숙제를 등록했어요')
      },
    }),
    { name: 'cometail-v2-store' },
  ),
)
