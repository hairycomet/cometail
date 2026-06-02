import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { dailyMissions, diaryPrompts, sampleDiaries, sampleHomework, sampleStudents, sampleUser, shopItems, weeklyQuests } from '../data/content'

const calcLevel = points => Math.max(1, Math.floor(points / 100) + 1)
const randomItem = owned => shopItems.filter(item => item.type !== 'Gift Box' && !owned.includes(item.id))[Math.floor(Math.random() * Math.max(1, shopItems.filter(item => item.type !== 'Gift Box' && !owned.includes(item.id)).length))]

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: sampleUser,
      diaries: sampleDiaries,
      homework: sampleHomework,
      students: sampleStudents,
      missions: dailyMissions,
      quests: weeklyQuests,
      theme: 'light',
      isAuthed: true,
      currentPrompt: diaryPrompts[0],
      login: ({ email }) => set({ isAuthed: true, user: { ...get().user, email } }),
      logout: () => set({ isAuthed: false }),
      completeOnboarding: data => set(state => ({ user: { ...state.user, ...data } })),
      toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setThemeColor: themeColor => {
        set(state => ({ user: { ...state.user, themeColor } }))
        toast.success('테마색을 바꿨어요')
      },
      setDisplayMode: displayMode => set(state => ({ user: { ...state.user, displayMode } })),
      updateProfile: data => {
        set(state => ({ user: { ...state.user, ...data } }))
        toast.success('설정을 저장했어요')
      },
      rotatePrompt: () => {
        const current = get().currentPrompt
        const index = diaryPrompts.indexOf(current)
        set({ currentPrompt: diaryPrompts[(index + 1) % diaryPrompts.length] })
      },
      addPoints: points => set(state => {
        const next = state.user.points + points
        return { user: { ...state.user, points: next, level: calcLevel(next) } }
      }),
      addDiary: ({ title, content }) => {
        const entry = {
          id: crypto.randomUUID(), userId: get().user.uid, nickname: get().user.nickname,
          title: title || 'Untitled Diary', content, feedback: '', corrected: '', natural: '', expression: '', teacherComment: '',
          createdAt: dayjs().toISOString(), points: 10,
        }
        set(state => {
          const newPoints = state.user.points + 10
          const completedMissions = [...new Set([...(state.user.completedMissions || []), 'daily_diary'])]
          return {
            diaries: [entry, ...state.diaries],
            user: { ...state.user, completedMissions, points: newPoints, level: calcLevel(newPoints), streak: state.user.streak + 1, longestStreak: Math.max(state.user.longestStreak, state.user.streak + 1) },
          }
        })
        toast.success('+10pt 일기 저장 완료')
      },
      completeMission: missionId => {
        const mission = get().missions.find(item => item.id === missionId)
        if (!mission || get().user.completedMissions?.includes(missionId)) return
        set(state => {
          const newPoints = state.user.points + mission.reward
          return { user: { ...state.user, points: newPoints, level: calcLevel(newPoints), completedMissions: [...(state.user.completedMissions || []), missionId] } }
        })
        toast.success(`+${mission.reward}pt 미션 완료`)
      },
      completeQuest: questId => {
        const quest = get().quests.find(item => item.id === questId)
        if (!quest || get().user.completedQuests?.includes(questId)) return
        set(state => {
          const newPoints = state.user.points + quest.reward
          return { user: { ...state.user, points: newPoints, level: calcLevel(newPoints), completedQuests: [...(state.user.completedQuests || []), questId] } }
        })
        toast.success(`+${quest.reward}pt 주간 퀘스트 완료`)
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
        if (user.owned?.includes(itemId) && item.type !== 'Gift Box') { toast('이미 가지고 있어요'); return }
        if (user.points < item.price) { toast.error('포인트가 부족해요'); return }
        if (item.type === 'Gift Box') {
          const prize = randomItem(user.owned || [])
          set(state => ({ user: { ...state.user, points: state.user.points - item.price, owned: [...new Set([...(state.user.owned || []), prize?.id].filter(Boolean))] } }))
          toast.success(`${prize?.name || '아이템'}이 나왔어요`)
          return
        }
        set(state => ({ user: { ...state.user, points: state.user.points - item.price, owned: [...(state.user.owned || []), itemId] } }))
        toast.success(`${item.name} 구매 완료`)
      },
      equipItem: itemId => {
        const item = shopItems.find(product => product.id === itemId)
        if (!item) return
        const wearableTypes = ['Hat', 'Face', 'Outfit', 'Tail', 'Hand', 'Background', 'Badge']
        if (!wearableTypes.includes(item.type)) { toast('장착 아이템이 아니에요'); return }
        set(state => {
          const sameTypeIds = shopItems.filter(product => product.type === item.type).map(product => product.id)
          const kept = (state.user.equipped || []).filter(id => !sameTypeIds.includes(id))
          return { user: { ...state.user, equipped: [...kept, itemId] } }
        })
        toast.success('캐릭터에 장착했어요')
      },
      saveExpression: expression => {
        if (!expression?.trim()) return
        set(state => ({ user: { ...state.user, savedExpressions: [...new Set([...(state.user.savedExpressions || []), expression.trim()])] } }))
        toast.success('표현 보관함에 저장했어요')
      },
      addFeedback: (diaryId, feedbackData) => {
        set(state => ({ diaries: state.diaries.map(diary => diary.id === diaryId ? { ...diary, ...feedbackData, feedback: feedbackData.feedback || diary.feedback } : diary) }))
        if (feedbackData.expression) get().saveExpression(feedbackData.expression)
        toast.success('피드백 저장 완료')
      },
      teacherGift: ({ itemId, points = 0 }) => {
        set(state => {
          const newPoints = state.user.points + Number(points || 0)
          const owned = itemId ? [...new Set([...(state.user.owned || []), itemId])] : state.user.owned
          return { user: { ...state.user, points: newPoints, level: calcLevel(newPoints), owned } }
        })
        toast.success('선생님 선물을 지급했어요')
      },
      addHomework: homework => {
        set(state => ({ homework: [{ id: crypto.randomUUID(), status: 'open', reward: 15, ...homework }, ...state.homework] }))
        toast.success('숙제를 등록했어요')
      },
    }),
    { name: 'cometail-v3-store' },
  ),
)
