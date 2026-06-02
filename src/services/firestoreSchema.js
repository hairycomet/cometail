export const firestoreCollections = {
  users: 'users',
  inviteCodes: 'inviteCodes',
  diaries: 'diaries',
  feedbacks: 'feedbacks',
  homeworks: 'homeworks',
  submissions: 'submissions',
  items: 'items',
  purchases: 'purchases',
  typingRecords: 'typingRecords',
  universe: 'universe',
  planets: 'planets',
  notifications: 'notifications',
}

export const userRoles = {
  teacher: 'teacher',
  student: 'student',
}

export const inviteCodeRules = {
  normalize: code => (code || '').trim().replace(/\s+/g, '').toUpperCase(),
  oneTimeStudentInvite: true,
  defaultStudentTickets: 1,
}
