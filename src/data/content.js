import dayjs from 'dayjs'

export const invitationCodes = ['COMET2026', 'COMETKIDS', 'IELTS55', 'TOEFL100']

export const diaryPrompts = [
  'What made you smile today?',
  'Describe one small problem you solved today.',
  'Write about one person you talked to today.',
  'What is one thing you want to improve this week?',
  'Describe today using three adjectives and explain why.',
  'What did you learn from class, work, or your daily life today?',
]

export const typingSentences = [
  'Small steps every day can build strong English skills.',
  'I can explain my ideas clearly when I practice slowly.',
  'Making mistakes is part of becoming a confident speaker.',
  'Today I will write one sentence better than yesterday.',
  'Cometail helps me keep learning even after class ends.',
]

export const shopItems = [
  { id: 'streak_shield', name: 'Streak Shield', emoji: '🛡️', price: 80, type: 'boost', desc: '하루 놓쳐도 스트릭을 지켜줘요.' },
  { id: 'golden_cap', name: 'Golden Cap', emoji: '🧢', price: 120, type: 'avatar', desc: 'Comet 캐릭터에게 씌우는 반짝 모자.' },
  { id: 'star_hoodie', name: 'Star Hoodie', emoji: '🧥', price: 160, type: 'avatar', desc: '꾸준한 학생을 위한 별빛 후디.' },
  { id: 'extra_invite', name: 'Extra Invite', emoji: '🎟️', price: 200, type: 'community', desc: '친구를 초대할 수 있는 추가 초대권.' },
]

export const sampleUser = {
  uid: 'demo-student',
  email: 'student@cometail.app',
  nickname: 'Comet Student',
  goal: 'Write English more naturally',
  points: 245,
  streak: 6,
  longestStreak: 14,
  level: 4,
  isAdmin: false,
  equipped: ['golden_cap'],
  owned: ['golden_cap'],
  inviteCode: 'COMET2026',
  createdAt: dayjs().subtract(10, 'day').toISOString(),
}

export const sampleDiaries = [
  {
    id: 'd1',
    userId: 'demo-student',
    nickname: 'Comet Student',
    title: 'A small win at work',
    content: 'Today I explained my opinion in English during a meeting. It was not perfect, but I felt proud because I did not give up.',
    feedback: 'Great job. Try saying “I was proud of myself because I did not give up.” This sounds more natural.',
    createdAt: dayjs().subtract(0, 'day').hour(21).toISOString(),
    points: 10,
  },
  {
    id: 'd2',
    userId: 'demo-student',
    nickname: 'Comet Student',
    title: 'My weekend plan',
    content: 'I am going to read a short book and practice typing for ten minutes. I want to keep my streak this week.',
    feedback: '',
    createdAt: dayjs().subtract(1, 'day').hour(20).toISOString(),
    points: 10,
  },
  {
    id: 'd3',
    userId: 'demo-student',
    nickname: 'Comet Student',
    title: 'A new expression',
    content: 'I learned the expression “That makes sense.” I can use it when I understand someone’s explanation.',
    feedback: 'Excellent. You can also say “I see what you mean.”',
    createdAt: dayjs().subtract(3, 'day').hour(22).toISOString(),
    points: 10,
  },
]

export const sampleHomework = [
  { id: 'h1', title: 'Write a 120 word diary', due: dayjs().add(1, 'day').format('YYYY-MM-DD'), status: 'open', reward: 15, desc: 'Use at least three expressions from today’s class.' },
  { id: 'h2', title: 'Typing practice 5 minutes', due: dayjs().add(3, 'day').format('YYYY-MM-DD'), status: 'open', reward: 15, desc: 'Submit your best WPM and accuracy.' },
  { id: 'h3', title: 'Revise teacher feedback', due: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), status: 'submitted', reward: 15, desc: 'Rewrite yesterday’s diary using the corrected version.' },
]

export const sampleStudents = [
  { id: 's1', name: 'Comet Student', streak: 6, points: 245, diaryCount: 8, lastActive: 'Today' },
  { id: 's2', name: 'IELTS Learner', streak: 4, points: 210, diaryCount: 6, lastActive: 'Yesterday' },
  { id: 's3', name: 'TOEFL Star', streak: 10, points: 390, diaryCount: 12, lastActive: 'Today' },
]
