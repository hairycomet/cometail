export const firestoreCollections = {
  users: 'users', inviteCodes: 'inviteCodes', pairs: 'pairs', pairEntries: 'pairEntries',
  memories: 'memories', reactions: 'reactions', reports: 'reports', notifications: 'notifications',
}

export const userShape = {
  uid: 'Firebase Auth uid', email: 'string', role: 'student | teacher', nickname: 'string',
  cometName: 'string', adultConfirmed: 'boolean', startMode: 'friend | anonymous | solo',
  points: 'personal starlight', level: 'personal Comet level', pairId: 'optional pair document id',
  inviteTickets: 'number, default 1', hasOnboarded: 'boolean',
}

export const pairShape = {
  members: 'array of exactly two user ids', mode: 'friend | anonymous', status: 'waiting | connected | paused | ended',
  pairStreak: 'number', pairLight: 'number', stage: 'First Signal | Orbit | Starlight | Connection',
  constellationStars: 'number', sharedStyle: 'pair look id', currentQuestionId: 'string',
}

export const pairEntryShape = {
  pairId: 'pair document id', date: 'YYYY-MM-DD', questionId: 'string',
  answers: 'map keyed by uid; each item contains text, optional photoUrl, submittedAt',
  unlocked: 'true only after both answers are submitted', reactions: 'array or subcollection',
  feedback: 'optional private language support keyed by uid',
}
