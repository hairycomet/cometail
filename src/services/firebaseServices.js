// Firebase service layer placeholder for the next implementation step.
// The UI can run in demo mode now. When Firebase is wired, keep page code stable
// and replace these functions with real Auth and Firestore calls.

import { firestoreCollections } from './firestoreSchema'

export async function createUserProfileDraft({ uid, email, inviteCode }) {
  return {
    collection: firestoreCollections.users,
    uid,
    email,
    role: 'student',
    inviteCode,
    inviteTickets: 1,
    points: 0,
    level: 1,
    createdAt: new Date().toISOString(),
  }
}

export async function validateInviteCodeDraft(code) {
  return { valid: Boolean(code), normalized: (code || '').trim().toUpperCase() }
}

export async function saveDiaryDraft({ userId, diary }) {
  return { collection: firestoreCollections.diaries, userId, diary }
}

export async function saveTeacherFeedbackDraft({ diaryId, feedback }) {
  return { collection: firestoreCollections.feedbacks, diaryId, feedback }
}
