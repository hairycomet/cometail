import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { auth, db, hasFirebaseConfig } from '../firebase/config'
import { firestoreCollections } from './firestoreSchema'

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'hairycomet@gmail.com')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

export const normalizeInviteCode = code => (code || '').trim().replace(/\s+/g, '').toUpperCase()
export const canUseFirebase = Boolean(hasFirebaseConfig && auth && db)
export const isBootstrapTeacherEmail = email => adminEmails.includes((email || '').trim().toLowerCase())

const nowIso = () => new Date().toISOString()

export function makeStudentProfile({ uid, email, inviteCode }) {
  return {
    uid,
    email: email || '',
    role: 'student',
    nickname: 'New Comet',
    cometName: 'Lumi',
    goal: '',
    goalType: 'English Diary',
    appLanguage: 'ko',
    diaryVisibilityDefault: 'private',
    points: 0,
    totalEarned: 0,
    universeInvestment: 0,
    planetInvestment: 0,
    streak: 0,
    longestStreak: 0,
    level: 1,
    hasOnboarded: false,
    owned: [],
    equipped: [],
    planetDecor: [],
    completedMissions: [],
    completedQuests: [],
    reviewedExpressions: [],
    savedExpressions: [],
    savedPatterns: [],
    typingRecords: [],
    diaryDraft: null,
    firstJourney: { firstDiary: false, firstGift: false, firstWardrobe: false, firstTyping: false, firstNotebook: false },
    inviteTickets: 1,
    usedInviteTickets: 0,
    generatedInviteCodes: [],
    inviteCode: inviteCode || '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function makeTeacherProfile({ uid, email }) {
  return {
    ...makeStudentProfile({ uid, email, inviteCode: 'TEACHER' }),
    role: 'teacher',
    nickname: 'Comet Teacher',
    cometName: 'Comet T',
    hasOnboarded: true,
    inviteTickets: 999,
  }
}

export function toClientUser(profile) {
  return {
    ...profile,
    isAdmin: profile.role === 'teacher',
    hasOnboarded: Boolean(profile.hasOnboarded),
  }
}

export async function getUserProfile(uid) {
  if (!canUseFirebase || !uid) return null
  const snap = await getDoc(doc(db, firestoreCollections.users, uid))
  return snap.exists() ? toClientUser(snap.data()) : null
}

export async function ensureUserProfile(firebaseUser) {
  if (!canUseFirebase || !firebaseUser) return null
  const ref = doc(db, firestoreCollections.users, firebaseUser.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return toClientUser(snap.data())

  const profile = isBootstrapTeacherEmail(firebaseUser.email)
    ? makeTeacherProfile({ uid: firebaseUser.uid, email: firebaseUser.email })
    : makeStudentProfile({ uid: firebaseUser.uid, email: firebaseUser.email, inviteCode: '' })
  await setDoc(ref, { ...profile, createdAtServer: serverTimestamp(), updatedAtServer: serverTimestamp() })
  return toClientUser(profile)
}

export function listenToAuthState(callback) {
  if (!canUseFirebase) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, async firebaseUser => {
    try {
      if (!firebaseUser) {
        callback(null)
        return
      }
      const profile = await ensureUserProfile(firebaseUser)
      callback(profile)
    } catch (error) {
      console.error('Auth state restore failed', error)
      callback(null)
    }
  }, error => {
    console.error('Auth listener failed', error)
    callback(null)
  })
}

export async function signInCometail({ email, password }) {
  if (!canUseFirebase) return null
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const profile = await ensureUserProfile(credential.user)
  return profile
}

export async function validateInviteCodeRemote(code) {
  if (!canUseFirebase) return { valid: false, reason: 'firebase-not-configured' }
  const normalized = normalizeInviteCode(code)
  if (!normalized) return { valid: false, reason: 'empty' }

  const ref = doc(db, firestoreCollections.inviteCodes, normalized)
  const snap = await getDoc(ref)
  if (!snap.exists()) return { valid: false, reason: 'not-found' }

  const data = snap.data()
  const active = data.active !== false
  const maxUses = Number(data.maxUses || 1)
  const used = Number(data.usedCount ?? data.used ?? 0)
  const expiresAt = data.expiresAt?.toDate ? data.expiresAt.toDate() : data.expiresAt ? new Date(data.expiresAt) : null
  const expired = expiresAt ? expiresAt.getTime() < Date.now() : false

  if (!active) return { valid: false, reason: 'inactive' }
  if (expired) return { valid: false, reason: 'expired' }
  if (used >= maxUses) return { valid: false, reason: 'used-up' }
  return { valid: true, code: normalized, record: { id: normalized, ...data } }
}

export async function signUpWithInvite({ email, password, inviteCode }) {
  if (!canUseFirebase) return null
  const normalized = normalizeInviteCode(inviteCode)
  const check = await validateInviteCodeRemote(normalized)
  if (!check.valid) {
    throw new Error('invalid-invite-code')
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const userRef = doc(db, firestoreCollections.users, credential.user.uid)
  const inviteRef = doc(db, firestoreCollections.inviteCodes, normalized)
  const profile = makeStudentProfile({ uid: credential.user.uid, email, inviteCode: normalized })

  try {
    await runTransaction(db, async transaction => {
      const inviteSnap = await transaction.get(inviteRef)
      if (!inviteSnap.exists()) throw new Error('invalid-invite-code')
      const invite = inviteSnap.data()
      const active = invite.active !== false
      const maxUses = Number(invite.maxUses || 1)
      const used = Number(invite.usedCount ?? invite.used ?? 0)
      const expiresAt = invite.expiresAt?.toDate ? invite.expiresAt.toDate() : invite.expiresAt ? new Date(invite.expiresAt) : null
      const expired = expiresAt ? expiresAt.getTime() < Date.now() : false
      if (!active || expired || used >= maxUses) throw new Error('invalid-invite-code')

      transaction.update(inviteRef, {
        usedCount: used + 1,
        lastUsedAt: serverTimestamp(),
        lastUsedByEmail: email,
        lastUsedByUid: credential.user.uid,
      })
      transaction.set(userRef, {
        ...profile,
        createdAtServer: serverTimestamp(),
        updatedAtServer: serverTimestamp(),
      })
    })
  } catch (error) {
    try { await deleteUser(credential.user) } catch (_) { /* ignore cleanup failure */ }
    throw error
  }

  return toClientUser(profile)
}

export async function signOutCometail() {
  if (!canUseFirebase) return
  await signOut(auth)
}

export async function saveUserProfile(uid, updates) {
  if (!canUseFirebase || !uid) return null
  const ref = doc(db, firestoreCollections.users, uid)
  await updateDoc(ref, { ...updates, updatedAt: nowIso(), updatedAtServer: serverTimestamp() })
  const next = await getUserProfile(uid)
  return next
}

export async function createInviteCodeRemote({ code, label, maxUses = 1, createdBy }) {
  if (!canUseFirebase) return null
  const normalized = normalizeInviteCode(code || `COMET-${Math.random().toString(36).slice(2, 8)}`)
  const ref = doc(db, firestoreCollections.inviteCodes, normalized)
  await runTransaction(db, async transaction => {
    const snap = await transaction.get(ref)
    if (snap.exists()) throw new Error('invite-code-exists')
    transaction.set(ref, {
      code: normalized,
      label: label || 'Teacher invite',
      maxUses: Number(maxUses || 1),
      usedCount: 0,
      active: true,
      createdBy: createdBy || '',
      createdAt: nowIso(),
      createdAtServer: serverTimestamp(),
    })
  })
  return { code: normalized, label: label || 'Teacher invite', maxUses: Number(maxUses || 1), usedCount: 0, used: 0, active: true }
}

export async function createStudentInviteCodeRemote({ ownerUid, ownerNickname }) {
  if (!canUseFirebase) return null
  const ownerRef = doc(db, firestoreCollections.users, ownerUid)
  const code = normalizeInviteCode(`${(ownerNickname || 'COMET').replace(/[^a-z0-9]/gi, '').slice(0, 6) || 'COMET'}-${Math.random().toString(36).slice(2, 6)}`)
  const inviteRef = doc(db, firestoreCollections.inviteCodes, code)

  await runTransaction(db, async transaction => {
    const ownerSnap = await transaction.get(ownerRef)
    if (!ownerSnap.exists()) throw new Error('user-not-found')
    const owner = ownerSnap.data()
    const tickets = Number(owner.inviteTickets || 0)
    if (tickets < 1) throw new Error('no-invite-tickets')

    transaction.update(ownerRef, {
      inviteTickets: tickets - 1,
      usedInviteTickets: Number(owner.usedInviteTickets || 0) + 1,
      generatedInviteCodes: [code, ...(owner.generatedInviteCodes || [])],
      updatedAt: nowIso(),
      updatedAtServer: serverTimestamp(),
    })
    transaction.set(inviteRef, {
      code,
      label: `${ownerNickname || 'Student'} invite`,
      maxUses: 1,
      usedCount: 0,
      active: true,
      createdBy: ownerUid,
      createdByRole: 'student',
      createdAt: nowIso(),
      createdAtServer: serverTimestamp(),
    })
  })

  return { code, label: `${ownerNickname || 'Student'} invite`, maxUses: 1, usedCount: 0, used: 0, active: true }
}

export async function listInviteCodesRemote() {
  if (!canUseFirebase) return []
  const q = query(collection(db, firestoreCollections.inviteCodes), limit(50))
  const snap = await getDocs(q)
  return snap.docs
    .map(item => { const data = item.data(); return { id: item.id, ...data, used: Number(data.usedCount ?? data.used ?? 0) } })
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
}


export async function listUniverseStudentsRemote() {
  if (!canUseFirebase) return []
  const q = query(collection(db, firestoreCollections.users), limit(60))
  const snap = await getDocs(q)
  return snap.docs
    .map(item => {
      const data = item.data()
      return {
        id: data.uid || item.id,
        uid: data.uid || item.id,
        email: data.email || '',
        nickname: data.nickname || 'Cometail Learner',
        cometName: data.cometName || data.nickname || 'Comet',
        level: Number(data.level || 1),
        streak: Number(data.streak || 0),
        points: Number(data.points || 0),
        totalEarned: Number(data.totalEarned || data.points || 0),
        themeColor: data.themeColor || 'purple',
        equipped: data.equipped || [],
        universeInvestment: Number(data.universeInvestment || 0),
        planetInvestment: Number(data.planetInvestment || 0),
        planetDecor: data.planetDecor || [],
        planet: data.planet || null,
        role: data.role || 'student',
      }
    })
    .filter(item => item.role !== 'teacher')
    .sort((a, b) => Number(b.level || 0) - Number(a.level || 0))
}

export async function createDiaryRemote({ user, diary }) {
  if (!canUseFirebase) return null
  const diaryRef = doc(collection(db, firestoreCollections.diaries))
  const payload = {
    ...diary,
    id: diaryRef.id,
    userId: user.uid,
    userEmail: user.email,
    nickname: user.nickname,
    createdAt: nowIso(),
    createdAtServer: serverTimestamp(),
    updatedAt: nowIso(),
    status: diary.feedbackRequested ? 'waiting' : 'private',
  }
  await setDoc(diaryRef, payload)
  return payload
}

export async function listMyDiariesRemote(userId) {
  if (!canUseFirebase || !userId) return []
  const q = query(collection(db, firestoreCollections.diaries), where('userId', '==', userId), limit(100))
  const snap = await getDocs(q)
  return snap.docs
    .map(item => { const data = item.data(); return { id: item.id, ...data, used: Number(data.usedCount ?? data.used ?? 0) } })
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
}
