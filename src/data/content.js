import dayjs from 'dayjs'

export const invitationCodes = ['COMET2026', 'COMETKIDS', 'IELTS55', 'TOEFL100']

export const themePalettes = [
  { id: 'purple', name: 'Purple Comet', primary: '#7c3aed', accent: '#f97316', emoji: '💜' },
  { id: 'mint', name: 'Mint Star', primary: '#0f766e', accent: '#14b8a6', emoji: '🌿' },
  { id: 'sky', name: 'Sky Blue', primary: '#2563eb', accent: '#38bdf8', emoji: '🌤️' },
  { id: 'rose', name: 'Rose Pink', primary: '#db2777', accent: '#fb7185', emoji: '🌹' },
  { id: 'peach', name: 'Peach Glow', primary: '#ea580c', accent: '#fb923c', emoji: '🍑' },
  { id: 'lemon', name: 'Lemon Light', primary: '#ca8a04', accent: '#facc15', emoji: '🍋' },
  { id: 'forest', name: 'Forest Green', primary: '#15803d', accent: '#22c55e', emoji: '🌲' },
  { id: 'navy', name: 'Midnight Navy', primary: '#1e3a8a', accent: '#818cf8', emoji: '🌙' },
  { id: 'cream', name: 'Cream Beige', primary: '#92400e', accent: '#f59e0b', emoji: '🧸' },
]

export const diaryPrompts = [
  'What made you smile today?',
  'Describe one small problem you solved today.',
  'Write about one person you talked to today.',
  'What is one thing you want to improve this week?',
  'Describe today using three adjectives and explain why.',
  'What did you learn from class, work, or your daily life today?',
]

export const goalTypes = [
  'English Diary', 'TOEFL', 'Duolingo', 'IELTS', 'PTE', 'Conversation', 'School Writing', 'Childcare English', 'Business English'
]

export const typingSentences = [
  'Small steps every day can build strong English skills.',
  'I can explain my ideas clearly when I practice slowly.',
  'Making mistakes is part of becoming a confident speaker.',
  'Today I will write one sentence better than yesterday.',
  'Cometail helps me keep learning even after class ends.',
]

export const shopItems = [
  { id: 'streak_shield', name: 'Streak Shield', emoji: '🛡️', price: 80, type: 'Boost', rarity: 'Rare', desc: '하루 놓쳐도 스트릭을 지켜줘요.' },
  { id: 'extra_invite', name: 'Extra Invite', emoji: '🎟️', price: 200, type: 'Community', rarity: 'Epic', desc: '친구를 초대할 수 있는 추가 초대권.' },
  { id: 'basic_box', name: 'Comet Box', emoji: '🎁', price: 100, type: 'Gift Box', rarity: 'Surprise', desc: '랜덤 꾸미기 아이템 하나를 열 수 있어요.' },
  { id: 'golden_cap', name: 'Golden Cap', emoji: '🧢', price: 120, type: 'Hat', rarity: 'Common', desc: 'Comet 캐릭터에게 씌우는 반짝 모자.' },
  { id: 'wizard_hat', name: 'Wizard Hat', emoji: '🧙', price: 170, type: 'Hat', rarity: 'Rare', desc: '영어 마법사가 된 느낌의 보라색 모자.' },
  { id: 'comet_crown', name: 'Comet Crown', emoji: '👑', price: 320, type: 'Hat', rarity: 'Legendary', desc: '꾸준함의 왕관. 랭킹 상위권 느낌.' },
  { id: 'round_glasses', name: 'Round Glasses', emoji: '👓', price: 90, type: 'Face', rarity: 'Common', desc: '똑똑한 작가 느낌의 둥근 안경.' },
  { id: 'star_sunglasses', name: 'Star Sunglasses', emoji: '😎', price: 160, type: 'Face', rarity: 'Rare', desc: '무대 위 영어 스타 같은 선글라스.' },
  { id: 'star_hoodie', name: 'Star Hoodie', emoji: '🧥', price: 160, type: 'Outfit', rarity: 'Rare', desc: '꾸준한 학생을 위한 별빛 후디.' },
  { id: 'galaxy_cape', name: 'Galaxy Cape', emoji: '🦸', price: 260, type: 'Outfit', rarity: 'Epic', desc: '캐릭터 뒤에 은하수 망토를 달아줘요.' },
  { id: 'fire_tail', name: 'Fire Tail', emoji: '🔥', price: 220, type: 'Tail', rarity: 'Epic', desc: '스트릭이 뜨거워 보이는 불꽃 꼬리.' },
  { id: 'ice_tail', name: 'Ice Tail', emoji: '❄️', price: 220, type: 'Tail', rarity: 'Epic', desc: '차분한 집중력을 보여주는 아이스 꼬리.' },
  { id: 'rocket', name: 'Tiny Rocket', emoji: '🚀', price: 140, type: 'Hand', rarity: 'Common', desc: '빠르게 성장하는 학생을 위한 작은 로켓.' },
  { id: 'english_book', name: 'English Book', emoji: '📘', price: 130, type: 'Hand', rarity: 'Common', desc: '일기와 피드백을 좋아하는 학생 아이템.' },
  { id: 'coffee', name: 'Study Coffee', emoji: '☕', price: 110, type: 'Hand', rarity: 'Common', desc: '성인 학생에게 잘 어울리는 집중 아이템.' },
  { id: 'moon_bg', name: 'Moon Room', emoji: '🌕', price: 250, type: 'Background', rarity: 'Epic', desc: '밤에 공부하는 느낌의 배경.' },
  { id: 'london_bg', name: 'London Street', emoji: '🇬🇧', price: 300, type: 'Background', rarity: 'Epic', desc: '영국 거리 분위기의 프로필 배경.' },
  { id: 'library_bg', name: 'Quiet Library', emoji: '📚', price: 240, type: 'Background', rarity: 'Rare', desc: '차분한 독서실 느낌의 배경.' },
  { id: 'best_writer_badge', name: 'Best Writer Badge', emoji: '🏅', price: 400, type: 'Badge', rarity: 'Teacher Special', desc: '선생님이 특별히 주면 더 좋은 뱃지.' },
]

export const dailyMissions = [
  { id: 'daily_diary', title: '영어 일기 3문장 쓰기', reward: 10, type: 'Diary' },
  { id: 'daily_typing', title: '타자 연습 1회 완료하기', reward: 5, type: 'Typing' },
  { id: 'daily_feedback', title: '어제 피드백 한 문장 복습하기', reward: 5, type: 'Review' },
]

export const weeklyQuests = [
  { id: 'week_diaries', title: '이번 주 일기 5개 쓰기', reward: 80, goal: 5, progress: 3 },
  { id: 'week_typing', title: '타자 연습 총 15분 하기', reward: 60, goal: 15, progress: 7 },
  { id: 'week_review', title: '선생님 피드백 문장 10개 복습하기', reward: 70, goal: 10, progress: 4 },
]

export const sampleUser = {
  uid: 'demo-student',
  email: 'student@cometail.app',
  nickname: 'Comet Student',
  goal: 'Write English more naturally',
  goalType: 'English Diary',
  points: 545,
  streak: 6,
  longestStreak: 14,
  level: 6,
  isAdmin: false,
  themeColor: 'purple',
  displayMode: 'cute',
  equipped: ['golden_cap', 'star_hoodie', 'round_glasses', 'english_book'],
  owned: ['golden_cap', 'star_hoodie', 'round_glasses', 'english_book', 'streak_shield'],
  completedMissions: ['daily_feedback'],
  completedQuests: [],
  savedExpressions: ['I was proud of myself.', 'I see what you mean.'],
  inviteCode: 'COMET2026',
  createdAt: dayjs().subtract(10, 'day').toISOString(),
}

export const sampleDiaries = [
  {
    id: 'd1', userId: 'demo-student', nickname: 'Comet Student', title: 'A small win at work',
    content: 'Today I explained my opinion in English during a meeting. It was not perfect, but I felt proud because I did not give up.',
    feedback: 'Great job. Try saying “I was proud of myself because I did not give up.” This sounds more natural.',
    corrected: 'Today, I shared my opinion in English during a meeting. It was not perfect, but I was proud of myself because I did not give up.',
    natural: 'I managed to share my opinion in English at a meeting today. It was not perfect, but I felt proud of myself for trying.',
    expression: 'I was proud of myself for trying.',
    teacherComment: '좋은 방향이에요. felt proud 다음에는 of myself가 자주 와요.',
    createdAt: dayjs().subtract(0, 'day').hour(21).toISOString(), points: 10,
  },
  {
    id: 'd2', userId: 'demo-student', nickname: 'Comet Student', title: 'My weekend plan',
    content: 'I am going to read a short book and practice typing for ten minutes. I want to keep my streak this week.',
    feedback: '', corrected: '', natural: '', expression: '', teacherComment: '',
    createdAt: dayjs().subtract(1, 'day').hour(20).toISOString(), points: 10,
  },
  {
    id: 'd3', userId: 'demo-student', nickname: 'Comet Student', title: 'A new expression',
    content: 'I learned the expression “That makes sense.” I can use it when I understand someone’s explanation.',
    feedback: 'Excellent. You can also say “I see what you mean.”',
    corrected: 'I learned the expression “That makes sense.” I can use it when I understand someone’s explanation.',
    natural: 'Today I learned “That makes sense.” It is useful when I want to show that I understand someone’s explanation.',
    expression: 'That makes sense.',
    teacherComment: '이 표현은 회화에서 정말 자주 써요.',
    createdAt: dayjs().subtract(3, 'day').hour(22).toISOString(), points: 10,
  },
]

export const sampleHomework = [
  { id: 'h1', title: 'Write a 120 word diary', due: dayjs().add(1, 'day').format('YYYY-MM-DD'), status: 'open', reward: 15, desc: 'Use at least three expressions from today’s class.' },
  { id: 'h2', title: 'Typing practice 5 minutes', due: dayjs().add(3, 'day').format('YYYY-MM-DD'), status: 'open', reward: 15, desc: 'Submit your best WPM and accuracy.' },
  { id: 'h3', title: 'Revise teacher feedback', due: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), status: 'submitted', reward: 15, desc: 'Rewrite yesterday’s diary using the corrected version.' },
]

export const sampleStudents = [
  { id: 's1', name: 'Comet Student', streak: 6, points: 545, diaryCount: 8, lastActive: 'Today', risk: 'Safe' },
  { id: 's2', name: 'IELTS Learner', streak: 4, points: 410, diaryCount: 6, lastActive: 'Yesterday', risk: 'Needs reminder' },
  { id: 's3', name: 'TOEFL Star', streak: 10, points: 690, diaryCount: 12, lastActive: 'Today', risk: 'Great' },
  { id: 's4', name: 'Young Writer', streak: 2, points: 180, diaryCount: 3, lastActive: '3 days ago', risk: 'At risk' },
]
