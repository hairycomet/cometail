import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import {
  dailyMissions,
  diaryPrompts,
  inviteCodeRecords,
  sampleDiaries,
  sampleHomework,
  sampleStudents,
  sampleUser,
  shopItems,
  weeklyQuests,
} from '../data/content'

const calcLevel = points => Math.max(1, Math.floor(points / 100) + 1)
const wearableTypes = ['Hat', 'Face', 'Outfit', 'Tail', 'Hand', 'Background', 'Badge', 'Pet', 'Aura', 'Frame']
const randomItem = owned => {
  const pool = shopItems.filter(item => wearableTypes.includes(item.type) && !owned.includes(item.id))
  return pool[Math.floor(Math.random() * Math.max(1, pool.length))]
}
const effectiveLanguage = user => user.level >= 20 ? 'en' : user.appLanguage || 'ko'
const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'hairycomet@gmail.com')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)
const isTeacherEmail = email => adminEmails.includes((email || '').trim().toLowerCase())
const normalizeCode = code => (code || '').trim().replace(/\s+/g, '').toUpperCase()
const createStudentCode = nickname => {
  const seed = (nickname || 'COMET').replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase() || 'COMET'
  return `${seed}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: sampleUser,
      diaries: sampleDiaries,
      homework: sampleHomework,
      students: sampleStudents,
      missions: dailyMissions,
      quests: weeklyQuests,
      inviteCodes: inviteCodeRecords,
      typingRecords: sampleUser.typingRecords || [],
      notifications: [],
      theme: 'light',
      isAuthed: false,
      currentPrompt: diaryPrompts[0],
      getLanguage: () => effectiveLanguage(get().user),
      validateInviteCode: code => {
        const normalized = normalizeCode(code)
        const record = get().inviteCodes.find(item => item.code === normalized)
        return Boolean(record && record.active && record.used < record.maxUses)
      },
      login: ({ email }) => set(state => ({
        isAuthed: true,
        user: {
          ...state.user,
          email,
          isAdmin: isTeacherEmail(email),
          hasOnboarded: email === state.user.email ? state.user.hasOnboarded : true,
        },
      })),
      signup: ({ email, inviteCode }) => {
        const normalized = normalizeCode(inviteCode)
        if (!get().validateInviteCode(normalized)) {
          toast.error('참여코드를 다시 확인해주세요')
          return false
        }
        set(state => ({
          isAuthed: true,
          inviteCodes: state.inviteCodes.map(record => record.code === normalized ? { ...record, used: record.used + 1 } : record),
          user: {
            ...sampleUser,
            uid: crypto.randomUUID(),
            email,
            nickname: 'New Comet',
            cometName: 'Lumi',
            goal: '',
            points: 0,
            totalEarned: 0,
            universeInvestment: 0,
            planetInvestment: 0,
            level: 1,
            streak: 0,
            longestStreak: 0,
            hasOnboarded: false,
            typingRecords: [],
            reviewedExpressions: [],
            owned: [],
            equipped: [],
            planetDecor: [],
            completedMissions: [],
            completedQuests: [],
            inviteTickets: 1,
            usedInviteTickets: 0,
            generatedInviteCodes: [],
            inviteCode: normalized,
            isAdmin: false,
            createdAt: dayjs().toISOString(),
          },
        }))
        return true
      },
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
        if (item.id === 'extra_invite') {
          if (user.points < item.price) { toast.error('별빛이 부족해요'); return }
          set(state => ({ user: { ...state.user, points: state.user.points - item.price, inviteTickets: (state.user.inviteTickets || 0) + 1 } }))
          toast.success('초대권 1장이 추가됐어요')
          return
        }
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
      resetEquipped: () => set(state => ({ user: { ...state.user, equipped: [] } })),
      decoratePlanet: itemId => {
        const item = shopItems.find(product => product.id === itemId)
        const user = get().user
        if (!item || !['Planet', 'Room'].includes(item.type)) return
        if (!user.owned?.includes(itemId)) { toast.error('먼저 상점에서 구매해야 해요'); return }
        if (user.level < 30 && item.type === 'Planet') { toast.error('Level 30부터 행성 장식이 가능해요'); return }
        set(state => ({ user: { ...state.user, planetDecor: [...new Set([...(state.user.planetDecor || []), itemId])] } }))
        toast.success('우주 장식을 적용했어요')
      },
      removePlanetDecor: itemId => set(state => ({ user: { ...state.user, planetDecor: (state.user.planetDecor || []).filter(id => id !== itemId) } })),
      cheerStudent: (studentId, reactionId) => {
        set(state => ({ user: { ...state.user, universeCheers: { ...(state.user.universeCheers || {}), [`${studentId}-${reactionId}`]: true } } }))
        toast.success('응원을 보냈어요')
      },
      generateInviteCode: () => {
        const user = get().user
        if ((user.inviteTickets || 0) < 1) { toast.error('사용 가능한 초대권이 없어요'); return }
        const code = createStudentCode(user.nickname)
        set(state => ({
          inviteCodes: [{ code, label: `${state.user.nickname} invite`, maxUses: 1, used: 0, active: true }, ...state.inviteCodes],
          user: { ...state.user, inviteTickets: state.user.inviteTickets - 1, usedInviteTickets: (state.user.usedInviteTickets || 0) + 1, generatedInviteCodes: [code, ...(state.user.generatedInviteCodes || [])] },
        }))
        toast.success(`초대코드 ${code} 생성 완료`)
      },
      createAdminInviteCode: ({ code, label, maxUses }) => {
        const normalized = normalizeCode(code || `COMET-${Math.random().toString(36).slice(2, 7)}`)
        set(state => ({ inviteCodes: [{ code: normalized, label: label || 'Teacher invite', maxUses: Number(maxUses || 1), used: 0, active: true }, ...state.inviteCodes] }))
        toast.success('참여코드를 만들었어요')
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

      completeTypingPractice: record => {
        const reward = record?.completed ? 5 : 0
        set(state => {
          const newPoints = state.user.points + reward
          const totalEarned = (state.user.totalEarned || state.user.points) + reward
          const completedMissions = reward ? [...new Set([...(state.user.completedMissions || []), 'daily_typing'])] : state.user.completedMissions
          const typingRecord = { id: crypto.randomUUID(), createdAt: dayjs().toISOString(), ...record }
          return {
            typingRecords: [typingRecord, ...(state.typingRecords || [])],
            user: { ...state.user, points: newPoints, totalEarned, level: calcLevel(totalEarned), completedMissions, typingRecords: [typingRecord, ...(state.user.typingRecords || [])] },
          }
        })
        if (reward) toast.success('+5 Starlight')
      },
      reviewExpression: expression => {
        if (!expression) return
        if (get().user.reviewedExpressions?.includes(expression)) { toast('이미 복습했어요'); return }
        set(state => {
          const newPoints = state.user.points + 5
          const totalEarned = (state.user.totalEarned || state.user.points) + 5
          return {
            user: {
              ...state.user,
              points: newPoints,
              totalEarned,
              level: calcLevel(totalEarned),
              reviewedExpressions: [...(state.user.reviewedExpressions || []), expression],
              completedMissions: [...new Set([...(state.user.completedMissions || []), 'daily_feedback'])],
            },
          }
        })
        toast.success('+5 Starlight for review')
      },
      updateHomeworkStatus: (id, status) => {
        set(state => ({ homework: state.homework.map(item => item.id === id ? { ...item, status } : item) }))
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
    { name: 'cometail-v7-student-beta-store' },
  ),
)
