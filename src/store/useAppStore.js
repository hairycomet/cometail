import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { dailyMissions, diaryPrompts, sampleDiaries, sampleHomework, sampleStudents, sampleUser, shopItems, weeklyQuests } from '../data/content'

const calcLevel = points => Math.max(1, Math.floor(points / 100) + 1)
const wearableTypes = ['Hat', 'Face', 'Outfit', 'Tail', 'Hand', 'Background', 'Badge']
const randomItem = owned => {
  const pool = shopItems.filter(item => wearableTypes.includes(item.type) && !owned.includes(item.id))
  return pool[Math.floor(Math.random() * Math.max(1, pool.length))]
}
const effectiveLanguage = user => user.level >= 20 ? 'en' : user.appLanguage || 'ko'

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
      isAuthed: false,
      currentPrompt: diaryPrompts[0],
      getLanguage: () => effectiveLanguage(get().user),
      login: ({ email }) => set(state => ({
        isAuthed: true,
        user: {
          ...state.user,
          email,
          isAdmin: email === 'hairycomet@gmail.com' || email.includes('teacher') || email.includes('admin'),
          hasOnboarded: email === state.user.email ? state.user.hasOnboarded : true,
        },
      })),
      signup: ({ email }) => set(state => ({
        isAuthed: true,
        user: {
          ...state.user,
          email,
          points: 0,
          totalEarned: 0,
          universeInvestment: 0,
          planetInvestment: 0,
          level: 1,
          streak: 0,
          longestStreak: 0,
          hasOnboarded: false,
          owned: [],
          equipped: [],
          completedMissions: [],
          completedQuests: [],
        },
      })),
      logout: () => set({ isAuthed: false }),
      completeOnboarding: data => set(state => ({ user: { ...state.user, ...data, hasOnboarded: true } })),
      toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setThemeColor: themeColor => {
        set(state => ({ user: { ...state.user, themeColor } }))
        toast.success('테마를 바꿨어요')
      },
      setDisplayMode: displayMode => set(state => ({ user: { ...state.user, displayMode } })),
      updateProfile: data => {
        set(state => ({ user: { ...state.user, ...data } }))
        toast.success('설정을 저장했어요')
      },
      setLanguage: appLanguage => {
        if (get().user.level >= 20 && appLanguage === 'ko') {
          toast.error('Level 20부터는 English Universe로 전환돼요')
          return
        }
        set(state => ({ user: { ...state.user, appLanguage } }))
      },
      rotatePrompt: () => {
        const current = get().currentPrompt
        const index = diaryPrompts.indexOf(current)
        set({ currentPrompt: diaryPrompts[(index + 1) % diaryPrompts.length] })
      },
      addPoints: points => set(state => {
        const next = state.user.points + points
        const totalEarned = (state.user.totalEarned || state.user.points) + points
        return { user: { ...state.user, points: next, totalEarned, level: calcLevel(totalEarned) } }
      }),
      addDiary: ({ title, content, visibility }) => {
        const entry = {
          id: crypto.randomUUID(), userId: get().user.uid, nickname: get().user.nickname,
          title: title || 'Untitled Diary', content, visibility: visibility || get().user.diaryVisibilityDefault || 'private',
          feedback: '', corrected: '', natural: '', expression: '', teacherComment: '',
          createdAt: dayjs().toISOString(), points: 10,
        }
        set(state => {
          const newPoints = state.user.points + 10
          const totalEarned = (state.user.totalEarned || state.user.points) + 10
          const completedMissions = [...new Set([...(state.user.completedMissions || []), 'daily_diary'])]
          return {
            diaries: [entry, ...state.diaries],
            user: { ...state.user, completedMissions, points: newPoints, totalEarned, level: calcLevel(totalEarned), streak: state.user.streak + 1, longestStreak: Math.max(state.user.longestStreak, state.user.streak + 1) },
          }
        })
        toast.success('+10 Starlight')
      },
      completeMission: missionId => {
        const mission = get().missions.find(item => item.id === missionId)
        if (!mission || get().user.completedMissions?.includes(missionId)) return
        set(state => {
          const newPoints = state.user.points + mission.reward
          const totalEarned = (state.user.totalEarned || state.user.points) + mission.reward
          return { user: { ...state.user, points: newPoints, totalEarned, level: calcLevel(totalEarned), completedMissions: [...(state.user.completedMissions || []), missionId] } }
        })
        toast.success(`+${mission.reward} Starlight`)
      },
      completeQuest: questId => {
        const quest = get().quests.find(item => item.id === questId)
        if (!quest || get().user.completedQuests?.includes(questId)) return
        set(state => {
          const newPoints = state.user.points + quest.reward
          const totalEarned = (state.user.totalEarned || state.user.points) + quest.reward
          return { user: { ...state.user, points: newPoints, totalEarned, level: calcLevel(totalEarned), completedQuests: [...(state.user.completedQuests || []), questId] } }
        })
        toast.success(`+${quest.reward} Starlight`)
      },
      submitHomework: id => {
        set(state => {
          const newPoints = state.user.points + 15
          const totalEarned = (state.user.totalEarned || state.user.points) + 15
          return { homework: state.homework.map(item => item.id === id ? { ...item, status: 'submitted' } : item), user: { ...state.user, points: newPoints, totalEarned, level: calcLevel(totalEarned) } }
        })
        toast.success('+15 Starlight')
      },
      buyItem: itemId => {
        const item = shopItems.find(product => product.id === itemId)
        const { user } = get()
        if (!item) return
        if (user.owned?.includes(itemId) && item.type !== 'Gift Box') { toast('이미 가지고 있어요'); return }
        if (user.points < item.price) { toast.error('별빛이 부족해요'); return }
        if (item.type === 'Gift Box') {
          const prize = randomItem(user.owned || [])
          set(state => ({ user: { ...state.user, points: state.user.points - item.price, owned: [...new Set([...(state.user.owned || []), prize?.id].filter(Boolean))] } }))
          toast.success(`${prize?.name || '아이템'}이 나왔어요`)
          return
        }
        set(state => ({ user: { ...state.user, points: state.user.points - item.price, owned: [...new Set([...(state.user.owned || []), itemId])] } }))
        toast.success(`${item.name} 구매 완료`)
      },
      equipItem: itemId => {
        const item = shopItems.find(product => product.id === itemId)
        if (!item || !wearableTypes.includes(item.type)) { toast('장착 아이템이 아니에요'); return }
        set(state => {
          const sameTypeIds = shopItems.filter(product => product.type === item.type).map(product => product.id)
          const kept = (state.user.equipped || []).filter(id => !sameTypeIds.includes(id))
          return { user: { ...state.user, equipped: [...kept, itemId] } }
        })
        toast.success('장착했어요')
      },
      unequipType: type => set(state => {
        const sameTypeIds = shopItems.filter(product => product.type === type).map(product => product.id)
        return { user: { ...state.user, equipped: (state.user.equipped || []).filter(id => !sameTypeIds.includes(id)) } }
      }),
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
          const giftPoints = Number(points || 0)
          const newPoints = state.user.points + giftPoints
          const totalEarned = (state.user.totalEarned || state.user.points) + giftPoints
          const owned = itemId ? [...new Set([...(state.user.owned || []), itemId])] : state.user.owned
          return { user: { ...state.user, points: newPoints, totalEarned, level: calcLevel(totalEarned), owned } }
        })
        toast.success('선생님 선물을 지급했어요')
      },
      addHomework: homework => {
        set(state => ({ homework: [{ id: crypto.randomUUID(), status: 'open', reward: 15, ...homework }, ...state.homework] }))
        toast.success('숙제를 등록했어요')
      },
      investUniverse: amount => {
        const value = Number(amount)
        if (!value || get().user.points < value) { toast.error('투자할 별빛이 부족해요'); return }
        set(state => ({ user: { ...state.user, points: state.user.points - value, universeInvestment: (state.user.universeInvestment || 0) + value } }))
        toast.success(`우주에 ${value} Starlight 투자 완료`)
      },
      investPlanet: amount => {
        const value = Number(amount)
        const user = get().user
        if (user.level < 20) { toast.error('Level 20부터 행성을 만들 수 있어요'); return }
        if (!value || user.points < value) { toast.error('투자할 별빛이 부족해요'); return }
        set(state => ({ user: { ...state.user, points: state.user.points - value, planetInvestment: (state.user.planetInvestment || 0) + value } }))
        toast.success(`행성에 ${value} Starlight 투자 완료`)
      },
    }),
    { name: 'cometail-v4-universe-store' },
  ),
)
