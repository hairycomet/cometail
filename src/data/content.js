import dayjs from 'dayjs'

export const invitationCodes = ['COMET2026', 'COMETKIDS', 'IELTS55', 'TOEFL100']

export const inviteCodeRecords = [
  { code: 'COMET2026', label: 'Default student invite', maxUses: 30, used: 0, active: true },
  { code: 'IELTS55', label: 'IELTS group invite', maxUses: 12, used: 0, active: true },
  { code: 'TOEFL100', label: 'TOEFL group invite', maxUses: 12, used: 0, active: true },
]

export const universeReactions = [
  { id: 'cheer', labelKo: '응원해요', labelEn: 'Keep going', emoji: '👏' },
  { id: 'shine', labelKo: '빛나요', labelEn: 'Your comet shines', emoji: '✨' },
  { id: 'streak', labelKo: '꾸준해요', labelEn: 'Nice streak', emoji: '🔥' },
  { id: 'cool', labelKo: '행성 멋져요', labelEn: 'Cool planet', emoji: '🪐' },
]

export const storySlides = [
  {
    id: 'gate',
    titleKo: '초대받은 사람만 들어오는 작은 영어 우주',
    titleEn: 'Welcome to your private English universe',
    bodyKo: 'Cometail은 아무나 들어오는 공개 앱이 아니에요. 선생님에게 초대받은 학생들이 각자의 영어를 조용히 쌓고, 서로의 성장을 보며 자극을 받는 프라이빗 공간이에요.',
    bodyEn: 'Cometail is an invite-only English universe where each learner builds steady progress with teacher feedback and quiet motivation from the community.',
    emoji: '🌌',
  },
  {
    id: 'spark',
    titleKo: '네가 쓰는 한 문장은 별빛이 돼요',
    titleEn: 'Every sentence becomes starlight',
    bodyKo: '완벽한 영어가 아니어도 괜찮아요. 오늘 남긴 한 줄, 다시 고쳐 쓴 한 문장, 선생님 피드백을 복습한 순간이 모두 작은 별빛으로 쌓입니다.',
    bodyEn: 'Your English does not need to be perfect. Every sentence, revision, and review becomes starlight that powers your progress.',
    emoji: '✨',
  },
  {
    id: 'buddy',
    titleKo: 'Comet Buddy가 너와 함께 성장해요',
    titleEn: 'Meet your Comet Buddy',
    bodyKo: 'Comet Buddy는 네 영어 성장과 함께 자라는 별똥별 친구예요. 레벨이 오를수록 꼬리는 길어지고, 스트릭이 이어질수록 더 밝게 빛나요.',
    bodyEn: 'Your Comet Buddy grows with your English. Its tail becomes longer with your level and brighter with your streak.',
    emoji: '☄️',
  },
  {
    id: 'planet',
    titleKo: '별빛을 모아 너의 행성을 만들어요',
    titleEn: 'Build your planet with starlight',
    bodyKo: '모은 별빛은 아이템을 얻는 데만 쓰이지 않아요. 공용 우주에 투자하고, 더 넓은 공간을 열고, 언젠가는 너만의 행성을 만들고 꾸밀 수 있어요.',
    bodyEn: 'Starlight is not only for items. You can invest it in the shared universe and eventually create and decorate your own planet.',
    emoji: '🪐',
  },
  {
    id: 'galaxy',
    titleKo: '모두의 커멧이 같은 우주에서 빛나요',
    titleEn: 'Shine together in the Cometail Universe',
    bodyKo: '레벨이 오르면 공용 우주에 들어가 다른 학생들의 커멧과 행성을 볼 수 있어요. 일기 내용은 기본적으로 비공개지만, 서로의 꾸준함과 성장은 함께 볼 수 있어요.',
    bodyEn: 'As you level up, you can enter the shared universe and see other learners’ comets and planets. Diary content stays private by default, but growth can inspire everyone.',
    emoji: '🛰️',
  },
]



export const universeMilestones = [
  { level: 5, title: 'Enter the Universe', desc: '우주 공간 구경과 응원 보내기 해금' },
  { level: 10, title: 'Launch Your Comet', desc: '내 Comet Buddy를 공용 우주에 띄우기' },
  { level: 20, title: 'Create Your Planet', desc: '별빛을 투자해 나만의 행성 생성' },
  { level: 30, title: 'Decorate Your Planet', desc: '행성 장식과 작은 구조물 해금' },
  { level: 50, title: 'Expand Orbit', desc: '위성, 링, 별자리 장식 해금' },
]

export const themePalettes = [
  { id: 'purple', name: 'Comet Purple', primary: '#7c3aed', accent: '#f97316', bg1: '#ede9fe', bg2: '#fed7aa', emoji: '💜', vibe: '보라색 우주와 주황 별빛' },
  { id: 'mint', name: 'Mint Classroom', primary: '#0f766e', accent: '#14b8a6', bg1: '#ccfbf1', bg2: '#ecfeff', emoji: '🌿', vibe: '깔끔한 민트 공부방' },
  { id: 'sky', name: 'Sky Planet', primary: '#2563eb', accent: '#38bdf8', bg1: '#dbeafe', bg2: '#e0f2fe', emoji: '🌤️', vibe: '밝은 하늘색 행성' },
  { id: 'rose', name: 'Rose Galaxy', primary: '#db2777', accent: '#fb7185', bg1: '#fce7f3', bg2: '#ffe4e6', emoji: '🌹', vibe: '핑크빛 은하' },
  { id: 'peach', name: 'Peach Diary', primary: '#ea580c', accent: '#fb923c', bg1: '#ffedd5', bg2: '#fef3c7', emoji: '🍑', vibe: '따뜻한 일기장' },
  { id: 'forest', name: 'Forest Orbit', primary: '#15803d', accent: '#22c55e', bg1: '#dcfce7', bg2: '#f0fdf4', emoji: '🌲', vibe: '초록 행성과 자연' },
  { id: 'navy', name: 'Midnight Study', primary: '#1e3a8a', accent: '#818cf8', bg1: '#172554', bg2: '#312e81', emoji: '🌙', vibe: '밤 공부와 깊은 우주' },
  { id: 'cream', name: 'London Beige', primary: '#92400e', accent: '#f59e0b', bg1: '#fef3c7', bg2: '#fffbeb', emoji: '☕', vibe: '차분한 베이지 감성' },
]

export const diaryPrompts = [
  'What made you smile today?',
  'Describe one small problem you solved today.',
  'Write about one person you talked to today.',
  'What is one thing you want to improve this week?',
  'Describe today using three adjectives and explain why.',
  'What did you learn from class, work, or your daily life today?',
]

export const goalTypes = ['English Diary', 'TOEFL', 'Duolingo', 'IELTS', 'PTE', 'Conversation', 'School Writing', 'Childcare English', 'Business English']

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
  { id: 'golden_cap', name: 'Golden Cap', emoji: '🧢', price: 120, type: 'Hat', rarity: 'Common', desc: '반짝이는 기본 모자.' },
  { id: 'wizard_hat', name: 'Wizard Hat', emoji: '🧙', price: 170, type: 'Hat', rarity: 'Rare', desc: '영어 마법사 느낌의 보라색 모자.' },
  { id: 'comet_crown', name: 'Comet Crown', emoji: '👑', price: 320, type: 'Hat', rarity: 'Legendary', desc: '꾸준함의 왕관.' },
  { id: 'round_glasses', name: 'Round Glasses', emoji: '👓', price: 90, type: 'Face', rarity: 'Common', desc: '똑똑한 작가 느낌의 둥근 안경.' },
  { id: 'star_sunglasses', name: 'Star Sunglasses', emoji: '😎', price: 160, type: 'Face', rarity: 'Rare', desc: '무대 위 영어 스타 같은 선글라스.' },
  { id: 'star_hoodie', name: 'Star Hoodie', emoji: '🧥', price: 160, type: 'Outfit', rarity: 'Rare', desc: '꾸준한 학생을 위한 별빛 후디.' },
  { id: 'galaxy_cape', name: 'Galaxy Cape', emoji: '🦸', price: 260, type: 'Outfit', rarity: 'Epic', desc: '은하수 망토.' },
  { id: 'fire_tail', name: 'Fire Tail', emoji: '🔥', price: 220, type: 'Tail', rarity: 'Epic', desc: '스트릭이 뜨거워 보이는 불꽃 꼬리.' },
  { id: 'ice_tail', name: 'Ice Tail', emoji: '❄️', price: 220, type: 'Tail', rarity: 'Epic', desc: '차분한 집중력을 보여주는 아이스 꼬리.' },
  { id: 'rocket', name: 'Tiny Rocket', emoji: '🚀', price: 140, type: 'Hand', rarity: 'Common', desc: '빠르게 성장하는 학생을 위한 작은 로켓.' },
  { id: 'english_book', name: 'English Book', emoji: '📘', price: 130, type: 'Hand', rarity: 'Common', desc: '일기와 피드백을 좋아하는 학생 아이템.' },
  { id: 'coffee', name: 'Study Coffee', emoji: '☕', price: 110, type: 'Hand', rarity: 'Common', desc: '성인 학생에게 잘 어울리는 집중 아이템.' },
  { id: 'moon_bg', name: 'Moon Room', emoji: '🌕', price: 250, type: 'Background', rarity: 'Epic', desc: '밤에 공부하는 느낌의 배경.' },
  { id: 'london_bg', name: 'London Street', emoji: '🇬🇧', price: 300, type: 'Background', rarity: 'Epic', desc: '영국 거리 분위기의 프로필 배경.' },
  { id: 'library_bg', name: 'Quiet Library', emoji: '📚', price: 240, type: 'Background', rarity: 'Rare', desc: '차분한 독서실 느낌의 배경.' },
  { id: 'best_writer_badge', name: 'Best Writer Badge', emoji: '🏅', price: 400, type: 'Badge', rarity: 'Teacher Special', desc: '선생님이 특별히 주면 더 좋은 뱃지.' },
  { id: 'moon_cat', name: 'Moon Cat', emoji: '🐈‍⬛', price: 360, type: 'Pet', rarity: 'Epic', desc: '행성 주변을 따라다니는 달빛 고양이.' },
  { id: 'rocket_puppy', name: 'Rocket Puppy', emoji: '🐶', price: 360, type: 'Pet', rarity: 'Epic', desc: 'Comet Buddy 옆을 지키는 작은 로켓 강아지.' },
  { id: 'soft_aura', name: 'Soft Aura', emoji: '💫', price: 260, type: 'Aura', rarity: 'Rare', desc: '캐릭터 주변을 부드럽게 빛나게 해요.' },
  { id: 'galaxy_aura', name: 'Galaxy Aura', emoji: '🌌', price: 520, type: 'Aura', rarity: 'Legendary', desc: '고레벨 커멧에게 어울리는 은하 오라.' },
  { id: 'study_frame', name: 'Study Frame', emoji: '🖼️', price: 220, type: 'Frame', rarity: 'Rare', desc: '프로필을 차분한 공부 느낌으로 꾸며요.' },
  { id: 'first_planet_seed', name: 'Planet Seed', emoji: '🌱', price: 300, type: 'Planet', rarity: 'Rare', desc: 'Level 20 이후 행성 성장에 사용할 수 있는 씨앗.' },
  { id: 'planet_ring_gold', name: 'Golden Planet Ring', emoji: '🪐', price: 650, type: 'Planet', rarity: 'Epic', desc: '내 행성에 금빛 고리를 추가해요.' },
  { id: 'planet_tree', name: 'Starlight Tree', emoji: '🌳', price: 420, type: 'Planet', rarity: 'Epic', desc: '행성 위에 별빛 나무를 심어요.' },
  { id: 'moon_chair', name: 'Moon Chair', emoji: '🌙', price: 300, type: 'Room', rarity: 'Rare', desc: '홈 화면에 둘 수 있는 달 의자.' },
  { id: 'offline_party_badge', name: 'Offline Party Badge', emoji: '🎉', price: 9999, type: 'Badge', rarity: 'Teacher Special', desc: '오프라인 모임 참가자에게만 지급되는 특별 뱃지.' },
]

export const dailyMissions = [
  { id: 'daily_diary', title: '영어 일기 3문장 쓰기', titleEn: 'Write a 3 sentence diary', reward: 10, type: 'Diary' },
  { id: 'daily_typing', title: '타자 연습 1회 완료하기', titleEn: 'Complete one typing practice', reward: 5, type: 'Typing' },
  { id: 'daily_feedback', title: '어제 피드백 한 문장 복습하기', titleEn: 'Review one feedback sentence', reward: 5, type: 'Review' },
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
  cometName: 'Lumi',
  goal: 'Write English more naturally',
  goalType: 'English Diary',
  points: 545,
  totalEarned: 545,
  universeInvestment: 120,
  planetInvestment: 0,
  streak: 6,
  longestStreak: 14,
  level: 6,
  isAdmin: false,
  hasOnboarded: true,
  appLanguage: 'ko',
  diaryVisibilityDefault: 'private',
  themeColor: 'purple',
  displayMode: 'default',
  equipped: ['golden_cap', 'star_hoodie', 'round_glasses', 'english_book', 'soft_aura', 'moon_cat'],
  owned: ['golden_cap', 'star_hoodie', 'round_glasses', 'english_book', 'soft_aura', 'moon_cat', 'streak_shield', 'moon_chair'],
  completedMissions: ['daily_feedback'],
  completedQuests: [],
  savedExpressions: ['I was proud of myself.', 'I see what you mean.'],
  inviteCode: 'COMET2026',
  inviteTickets: 1,
  usedInviteTickets: 0,
  generatedInviteCodes: ['FRIEND-STAR'],
  universeCheers: {},
  planetDecor: ['moon_chair'],
  createdAt: dayjs().subtract(10, 'day').toISOString(),
}

export const sampleDiaries = [
  { id: 'd1', userId: 'demo-student', nickname: 'Comet Student', title: 'A small win at work', content: 'Today I explained my opinion in English during a meeting. It was not perfect, but I felt proud because I did not give up.', visibility: 'teacher', feedback: 'Great job. Try saying “I was proud of myself because I did not give up.” This sounds more natural.', corrected: 'Today, I shared my opinion in English during a meeting. It was not perfect, but I was proud of myself because I did not give up.', natural: 'I managed to share my opinion in English at a meeting today. It was not perfect, but I felt proud of myself for trying.', expression: 'I was proud of myself for trying.', teacherComment: '좋은 방향이에요. felt proud 다음에는 of myself가 자주 와요.', createdAt: dayjs().subtract(0, 'day').hour(21).toISOString(), points: 10 },
  { id: 'd2', userId: 'demo-student', nickname: 'Comet Student', title: 'My weekend plan', content: 'I am going to read a short book and practice typing for ten minutes. I want to keep my streak this week.', visibility: 'private', feedback: '', corrected: '', natural: '', expression: '', teacherComment: '', createdAt: dayjs().subtract(1, 'day').hour(20).toISOString(), points: 10 },
  { id: 'd3', userId: 'demo-student', nickname: 'Comet Student', title: 'A new expression', content: 'I learned the expression “That makes sense.” I can use it when I understand someone’s explanation.', visibility: 'community', feedback: 'Excellent. You can also say “I see what you mean.”', corrected: 'I learned the expression “That makes sense.” I can use it when I understand someone’s explanation.', natural: 'Today I learned “That makes sense.” It is useful when I want to show that I understand someone’s explanation.', expression: 'That makes sense.', teacherComment: '이 표현은 회화에서 정말 자주 써요.', createdAt: dayjs().subtract(3, 'day').hour(22).toISOString(), points: 10 },
]

export const sampleHomework = [
  { id: 'h1', title: 'Write a 120 word diary', due: dayjs().add(1, 'day').format('YYYY-MM-DD'), status: 'open', reward: 15, desc: 'Use at least three expressions from today’s class.' },
  { id: 'h2', title: 'Typing practice 5 minutes', due: dayjs().add(3, 'day').format('YYYY-MM-DD'), status: 'open', reward: 15, desc: 'Submit your best WPM and accuracy.' },
  { id: 'h3', title: 'Revise teacher feedback', due: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), status: 'submitted', reward: 15, desc: 'Rewrite yesterday’s diary using the corrected version.' },
]

export const sampleStudents = [
  { id: 's1', name: 'Comet Student', cometName: 'Lumi', streak: 6, points: 545, level: 6, diaryCount: 8, lastActive: 'Today', risk: 'Safe', planet: null, themeColor: 'purple' },
  { id: 's2', name: 'IELTS Learner', cometName: 'Nova', streak: 11, points: 1450, level: 15, diaryCount: 22, lastActive: 'Today', risk: 'Great', planet: 'Tiny Moon', themeColor: 'sky' },
  { id: 's3', name: 'TOEFL Star', cometName: 'Aster', streak: 24, points: 2350, level: 24, diaryCount: 40, lastActive: 'Today', risk: 'Great', planet: 'Blue Planet', themeColor: 'mint' },
  { id: 's4', name: 'Young Writer', cometName: 'Sol', streak: 2, points: 3180, level: 32, diaryCount: 51, lastActive: 'Yesterday', risk: 'Needs reminder', planet: 'Rose Planet', themeColor: 'rose' },
]
