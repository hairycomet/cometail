export const firestoreCollections = {
  users: 'users',
  inviteCodes: 'inviteCodes',
  diaries: 'diaries',
  feedbacks: 'feedbacks',
  homeworks: 'homeworks',
  submissions: 'submissions',
  items: 'items',
  purchases: 'purchases',
  equippedItems: 'equippedItems',
  missions: 'missions',
  typingRecords: 'typingRecords',
  universe: 'universe',
  planets: 'planets',
  notifications: 'notifications',
}

export const roleNames = {
  teacher: 'teacher',
  student: 'student',
}

export const inviteCodeShape = {
  code: 'string, document id, uppercased',
  label: 'string',
  maxUses: 'number',
  used: 'number',
  active: 'boolean',
  createdBy: 'uid or admin email',
  createdByRole: 'teacher | student',
  expiresAt: 'optional timestamp or ISO string',
}

export const userShape = {
  uid: 'Firebase Auth uid',
  email: 'string',
  role: 'teacher | student',
  nickname: 'string',
  cometName: 'string',
  inviteCode: 'string',
  inviteTickets: 'number, default 1 for students',
  points: 'Starlight balance',
  totalEarned: 'lifetime Starlight',
  level: 'derived from totalEarned',
  owned: 'item ids',
  equipped: 'item ids',
  hasOnboarded: 'boolean',
}
