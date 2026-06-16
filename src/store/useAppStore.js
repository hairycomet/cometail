import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { dailyQuestions } from '../data/pairContent'
import {
  canUseFirebase,
  listenToAuthState,
  saveUserProfile,
  signInCometail,
  signOutCometail,
  signUpWithInvite,
} from '../services/firebaseServices'

const blankUser = {
  uid: '', email: '', role: 'student', isAdmin: false, hasOnboarded: false,
  nickname: 'New Comet', cometName: 'Lumi', points: 0, level: 1, streak: 0,
  inviteTickets: 1, equipped: [], startMode: '', adultConfirmed: false,
}

const demoPair = {
  id: 'demo-orbit', mode: 'anonymous', status: 'connected',
  mate: { nickname: 'Starlit', cometName: 'Moa', level: 7, streak: 5, online: false },
  connectedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  pairStreak: 6, pairLight: 145, stage: 'Orbit', constellationStars: 6,
  sharedStyle: 'orbit-hoodie',
}

const defaultEntry = () => ({
  date: new Date().toISOString().slice(0, 10),
  questionId: dailyQuestions[0].id,
  myAnswer: '', mateAnswer: '', myPhoto: '', matePhoto: '',
  mySubmitted: false, mateSubmitted: false, unlocked: false,
  reactions: [], feedback: null,
})

const syncUser = async user => {
  if (!canUseFirebase || !user?.uid) return
  const { isAdmin, ...profile } = user
  try { await saveUserProfile(user.uid, profile) } catch (error) { console.warn('profile sync failed', error) }
}

export const useAppStore = create(persist((set, get) => ({
  user: blankUser,
  isAuthed: false,
  isAuthReady: !canUseFirebase,
  isFirebaseMode: canUseFirebase,
  theme: 'dark',
  pair: null,
  todayEntry: defaultEntry(),
  memories: [],
  matching: { status: 'idle', preferences: { ageRange: '20s-30s', genderPreference: 'any', vibe: 'English habit friend', time: 'evening' } },

  initializeAuth: () => {
    if (!canUseFirebase) { set({ isAuthReady: true }); return () => {} }
    set({ isAuthReady: false })
    const unsubscribe = listenToAuthState(profile => {
      if (!profile) set({ isAuthed: false, user: blankUser, isAuthReady: true })
      else set({ isAuthed: true, user: { ...blankUser, ...profile }, isAuthReady: true })
    })
    return unsubscribe
  },

  login: async ({ email, password }) => {
    try {
      if (canUseFirebase) {
        const profile = await signInCometail({ email: email.trim().toLowerCase(), password })
        set({ isAuthed: true, user: { ...blankUser, ...profile } })
      } else {
        set({ isAuthed: true, user: { ...blankUser, uid: 'local-user', email, hasOnboarded: true, nickname: 'Comet', cometName: 'Lumi', startMode: 'anonymous', adultConfirmed: true } })
      }
      toast.success('당신의 우주가 열렸어요')
      return true
    } catch (error) { toast.error('로그인 정보를 확인해주세요'); return false }
  },

  signup: async ({ email, password, inviteCode }) => {
    try {
      if (canUseFirebase) {
        const profile = await signUpWithInvite({ email: email.trim().toLowerCase(), password, inviteCode })
        set({ isAuthed: true, user: { ...blankUser, ...profile } })
      } else {
        if (!inviteCode.trim()) throw new Error('invite-required')
        set({ isAuthed: true, user: { ...blankUser, uid: crypto.randomUUID(), email, hasOnboarded: false } })
      }
      toast.success('초대 확인 완료')
      return true
    } catch (error) { toast.error('초대코드 또는 가입 정보를 확인해주세요'); return false }
  },

  logout: async () => { try { await signOutCometail() } catch (_) {} set({ isAuthed: false, user: blankUser, pair: null }) },

  completeOnboarding: async data => {
    const nextUser = { ...get().user, ...data, hasOnboarded: true }
    const nextPair = data.startMode === 'solo' ? null : data.startMode === 'friend' ? {
      ...demoPair, mode: 'friend', status: 'waiting', mate: null, pairCode: `ORBIT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    } : demoPair
    set({ user: nextUser, pair: nextPair })
    await syncUser(nextUser)
  },

  connectDemoMate: () => set({ pair: demoPair }),
  startMatching: preferences => {
    set({ matching: { status: 'searching', preferences } })
    window.setTimeout(() => {
      set({ matching: { status: 'matched', preferences }, pair: demoPair })
      toast.success('새로운 별빛 신호가 도착했어요')
    }, 900)
  },
  cancelMatching: () => set(state => ({ matching: { ...state.matching, status: 'idle' } })),

  setMyAnswer: value => set(state => ({ todayEntry: { ...state.todayEntry, myAnswer: value } })),
  setMyPhoto: value => set(state => ({ todayEntry: { ...state.todayEntry, myPhoto: value } })),
  submitMyEntry: () => {
    const state = get()
    if (!state.todayEntry.myAnswer.trim()) { toast.error('한 문장이라도 남겨주세요'); return }
    const mateAlreadySubmitted = state.todayEntry.mateSubmitted
    const next = {
      ...state.todayEntry,
      mySubmitted: true,
      unlocked: mateAlreadySubmitted,
      feedback: {
        natural: state.todayEntry.myAnswer.replace(/\bi\b/g, 'I').trim(),
        expression: 'One small thing that made me happy was ~',
        meaning: '나를 기쁘게 한 작은 일은 ~였다',
      },
    }
    const nextUser = { ...state.user, points: Number(state.user.points || 0) + 5, streak: Math.max(1, Number(state.user.streak || 0)) }
    set({ todayEntry: next, user: nextUser })
    syncUser(nextUser)
    toast.success(mateAlreadySubmitted ? '두 별빛이 만났어요!' : '내 별빛을 보냈어요')
  },
  simulateMateEntry: () => {
    const state = get()
    const unlocked = state.todayEntry.mySubmitted
    const next = {
      ...state.todayEntry,
      mateSubmitted: true,
      mateAnswer: 'I felt happy when I found a quiet café after work. It made the evening feel slower and warmer.',
      matePhoto: '',
      unlocked,
    }
    const nextPair = unlocked && state.pair ? { ...state.pair, pairLight: state.pair.pairLight + 10, constellationStars: state.pair.constellationStars + 1, pairStreak: state.pair.pairStreak + 1 } : state.pair
    set({ todayEntry: next, pair: nextPair })
    toast.success(unlocked ? '오늘의 이야기가 열렸어요' : '상대의 별빛이 도착했어요')
  },
  addReaction: reaction => set(state => ({ todayEntry: { ...state.todayEntry, reactions: [...state.todayEntry.reactions, reaction] } })),
  saveTodayMemory: () => {
    const state = get()
    if (!state.todayEntry.unlocked) return
    if (state.memories.some(item => item.date === state.todayEntry.date)) { toast('이미 보관했어요'); return }
    set({ memories: [{ ...state.todayEntry, savedAt: new Date().toISOString() }, ...state.memories] })
    toast.success('별빛 보관함에 저장했어요')
  },
  sendNudge: () => toast.success('상대에게 별빛 신호를 보냈어요'),
  updatePairStyle: style => set(state => ({ pair: state.pair ? { ...state.pair, sharedStyle: style } : state.pair })),
  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}), {
  name: 'cometail-pair-v16',
  partialize: state => ({ user: state.user, isAuthed: state.isAuthed, theme: state.theme, pair: state.pair, todayEntry: state.todayEntry, memories: state.memories, matching: state.matching }),
}))
