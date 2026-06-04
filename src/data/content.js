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


export const levelStages = [
  { level: 1, title: 'First Spark', planet: 'Comet Dust', unlock: '기본 Comet Buddy', visual: '작은 꼬리와 부드러운 빛' },
  { level: 3, title: 'Tiny Glow', planet: 'Tiny Moon', unlock: '첫 이름표 색상', visual: '꼬리 입자 증가' },
  { level: 5, title: 'Galaxy Visitor', planet: 'Visitor Moon', unlock: 'Universe 구경과 응원', visual: '우주 입장 배지' },
  { level: 8, title: 'Soft Orbit', planet: 'Soft Orbit', unlock: '기본 오라 슬롯', visual: '캐릭터 주변 오라' },
  { level: 10, title: 'Comet Launch', planet: 'Comet Orbit', unlock: '공용 우주에 내 커멧 띄우기', visual: '더 긴 꼬리와 작은 별가루' },
  { level: 12, title: 'Star Friend', planet: 'Mini Star', unlock: '펫 슬롯 1', visual: '작은 동행 별' },
  { level: 15, title: 'Bright Trail', planet: 'Bright Moon', unlock: 'Rare Tail 장착', visual: '꼬리 색상 변화' },
  { level: 18, title: 'Little Explorer', planet: 'Explorer Moon', unlock: '프로필 프레임 슬롯', visual: '행성 테두리 빛' },
  { level: 20, title: 'Planet Maker', planet: 'Small Planet', unlock: '나만의 행성 생성', visual: '작은 행성 등장' },
  { level: 22, title: 'Cloud Planet', planet: 'Cloud Planet', unlock: '행성 구름 장식', visual: '행성 표면 패턴' },
  { level: 25, title: 'Crystal Path', planet: 'Crystal Moon', unlock: 'Epic Aura 해금', visual: '수정빛 하이라이트' },
  { level: 28, title: 'Moon Gardener', planet: 'Garden Moon', unlock: '행성 나무 장식', visual: '작은 식물과 빛' },
  { level: 30, title: 'Planet Decorator', planet: 'Ring Planet', unlock: '행성 장식 본격 해금', visual: '행성 링과 장식 슬롯' },
  { level: 35, title: 'Orbit Builder', planet: 'Double Ring Planet', unlock: '두 번째 링과 위성', visual: '복수 궤도' },
  { level: 40, title: 'Special Tail', planet: 'Aurora Planet', unlock: 'Special Tail 해금', visual: '희귀 꼬리와 오로라' },
  { level: 45, title: 'Nebula Maker', planet: 'Nebula Planet', unlock: 'Nebula 배경 장식', visual: '성운 배경 효과' },
  { level: 50, title: 'Galaxy Architect', planet: 'Galaxy Core', unlock: '큰 행성 확장', visual: '강한 오라와 별자리' },
  { level: 60, title: 'Constellation Keeper', planet: 'Constellation Planet', unlock: '별자리 장식 세트', visual: '연결된 별자리' },
  { level: 70, title: 'Comet Master', planet: 'Master Planet', unlock: 'Legendary 아이템 해금', visual: '전설 오라와 왕관빛' },
  { level: 80, title: 'Aurora Guardian', planet: 'Aurora Core', unlock: '오로라 은하 배경', visual: '다층 오로라' },
  { level: 90, title: 'Starlight Monarch', planet: 'Monarch Planet', unlock: 'Royal Frame', visual: '왕관 뱃지와 대형 행성' },
  { level: 100, title: 'Legendary Comet', planet: 'Legendary Galaxy', unlock: 'Legendary Comet Trail', visual: '전설 꼬리와 은하 중심 오라' },
]

export const getLevelStage = level => {
  const numeric = Number(level || 1)
  return [...levelStages].reverse().find(stage => numeric >= stage.level) || levelStages[0]
}

export const getNextLevelStage = level => {
  const numeric = Number(level || 1)
  return levelStages.find(stage => numeric < stage.level) || null
}

export const storySlides = [
  {
    id: 'gate',
    titleKo: '초대받은 사람만 들어오는 작은 영어 우주',
    titleEn: 'A private English galaxy begins here',
    bodyKo: 'Cometail은 모두에게 열린 공개 앱이 아니에요. 선생님에게 초대받은 학생들이 조용히 영어를 쌓고, 서로의 별빛을 보며 계속 돌아오게 되는 작은 프라이빗 우주예요.',
    bodyEn: 'Cometail is an invite-only English galaxy where invited learners build steady progress and quietly shine together.',
    emoji: '🌌',
  },
  {
    id: 'spark',
    titleKo: '완벽하지 않아도, 한 문장은 별빛이 돼요',
    titleEn: 'Every sentence becomes starlight',
    bodyKo: '오늘 쓴 한 줄, 다시 고쳐 쓴 문장, 선생님 피드백을 읽은 순간까지 모두 별빛으로 쌓여요. Cometail은 실수를 벌주는 공간이 아니라, 다시 쓰게 만드는 공간이에요.',
    bodyEn: 'Every sentence, revision, and feedback review becomes starlight. This is not a place that punishes mistakes. It helps you return and try again.',
    emoji: '✨',
  },
  {
    id: 'buddy',
    titleKo: '첫 Comet Buddy가 너를 기다리고 있어요',
    titleEn: 'Meet your Comet Buddy',
    bodyKo: 'Comet Buddy는 네 영어 성장과 함께 자라는 별똥별 친구예요. 레벨이 오를수록 꼬리는 길어지고, 스트릭이 이어질수록 더 밝게 빛나요.',
    bodyEn: 'Your Comet Buddy grows with your English. Its tail becomes longer with your level and brighter with your streak.',
    emoji: '☄️',
  },
  {
    id: 'planet',
    titleKo: '별빛을 모으면 너만의 행성이 열려요',
    titleEn: 'Build your planet with starlight',
    bodyKo: '모은 별빛은 아이템을 사는 데만 쓰이지 않아요. 공용 우주에 투자하고, 더 넓은 공간을 열고, 언젠가는 너만의 행성을 만들고 꾸밀 수 있어요.',
    bodyEn: 'Starlight is not only for items. Invest it in the shared universe and one day create and decorate your own planet.',
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
  { id: 'purple', name: 'Comet Purple', primary: '#7c3aed', accent: '#f97316', bg1: '#ede9fe', bg2: '#fed7aa', emoji: '💜', vibe: '보라 우주와 따뜻한 별빛' },
  { id: 'mint', name: 'Mint Classroom', primary: '#0f766e', accent: '#14b8a6', bg1: '#ccfbf1', bg2: '#ecfeff', emoji: '🌿', vibe: '차분한 민트 공부방' },
  { id: 'sky', name: 'Sky Planet', primary: '#2563eb', accent: '#38bdf8', bg1: '#dbeafe', bg2: '#e0f2fe', emoji: '🌤️', vibe: '밝고 시원한 하늘빛' },
  { id: 'rose', name: 'Rose Galaxy', primary: '#db2777', accent: '#fb7185', bg1: '#fce7f3', bg2: '#ffe4e6', emoji: '🌹', vibe: '부드러운 로즈 은하' },
  { id: 'peach', name: 'Peach Diary', primary: '#ea580c', accent: '#fb923c', bg1: '#ffedd5', bg2: '#fef3c7', emoji: '🍑', vibe: '따뜻한 복숭아 일기장' },
  { id: 'forest', name: 'Forest Orbit', primary: '#15803d', accent: '#22c55e', bg1: '#dcfce7', bg2: '#f0fdf4', emoji: '🌲', vibe: '싱그러운 초록 행성' },
  { id: 'navy', name: 'Midnight Study', primary: '#1e3a8a', accent: '#818cf8', bg1: '#172554', bg2: '#312e81', emoji: '🌙', vibe: '깊고 차분한 밤 우주' },
  { id: 'cream', name: 'London Beige', primary: '#92400e', accent: '#f59e0b', bg1: '#fef3c7', bg2: '#fffbeb', emoji: '☕', vibe: '차분한 런던 베이지' },
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
  { id: 'streak_shield', name: 'Streak Shield', emoji: '🛡️', price: 80, type: 'Boost', rarity: 'Rare', minLevel: 1, desc: '하루 놓쳐도 스트릭을 지켜줘요.' },
  { id: 'extra_invite', name: 'Extra Invite', emoji: '🎟️', price: 200, type: 'Community', rarity: 'Epic', minLevel: 1, desc: '친구를 초대할 수 있는 추가 초대권.' },
  { id: 'basic_box', name: 'Comet Box', emoji: '🎁', price: 100, type: 'Gift Box', rarity: 'Surprise', minLevel: 1, desc: '랜덤 꾸미기 아이템 하나를 열 수 있어요.' },
  { id: 'golden_cap', name: 'Golden Cap', emoji: '🧢', price: 120, type: 'Hat', rarity: 'Common', minLevel: 1, desc: '반짝이는 기본 모자.' },
  { id: 'wizard_hat', name: 'Wizard Hat', emoji: '🧙', price: 170, type: 'Hat', rarity: 'Rare', minLevel: 5, desc: '영어 마법사 느낌의 보라색 모자.' },
  { id: 'comet_crown', name: 'Comet Crown', emoji: '👑', price: 320, type: 'Hat', rarity: 'Legendary', minLevel: 30, desc: '꾸준함의 왕관.' },
  { id: 'moon_beret', name: 'Moon Beret', emoji: '🎩', price: 180, type: 'Hat', rarity: 'Rare', minLevel: 8, desc: '차분한 달빛 베레모.' },
  { id: 'aurora_beanie', name: 'Aurora Beanie', emoji: '🧶', price: 210, type: 'Hat', rarity: 'Rare', minLevel: 12, desc: '오로라빛 겨울 비니.' },
  { id: 'starlight_helmet', name: 'Starlight Helmet', emoji: '🪖', price: 280, type: 'Hat', rarity: 'Epic', minLevel: 20, desc: '우주 탐험가 헬멧.' },
  { id: 'royal_comet_diadem', name: 'Royal Diadem', emoji: '💎', price: 520, type: 'Hat', rarity: 'Legendary', minLevel: 50, desc: '고레벨 커멧 전용 왕관 장식.' },
  { id: 'round_glasses', name: 'Round Glasses', emoji: '👓', price: 90, type: 'Face', rarity: 'Common', minLevel: 1, desc: '똑똑한 작가 느낌의 둥근 안경.' },
  { id: 'star_sunglasses', name: 'Star Sunglasses', emoji: '😎', price: 160, type: 'Face', rarity: 'Rare', minLevel: 10, desc: '무대 위 영어 스타 같은 선글라스.' },
  { id: 'sleepy_eyes', name: 'Sleepy Eyes', emoji: '😌', price: 130, type: 'Face', rarity: 'Common', minLevel: 1, desc: '차분하고 느긋한 표정.' },
  { id: 'sparkle_blush', name: 'Sparkle Blush', emoji: '😊', price: 150, type: 'Face', rarity: 'Rare', minLevel: 5, desc: '볼에 작은 별빛이 반짝여요.' },
  { id: 'focus_visor', name: 'Focus Visor', emoji: '🥽', price: 260, type: 'Face', rarity: 'Epic', minLevel: 20, desc: '타자 연습러에게 어울리는 집중 바이저.' },
  { id: 'star_hoodie', name: 'Star Hoodie', emoji: '🧥', price: 160, type: 'Outfit', rarity: 'Rare', minLevel: 1, desc: '꾸준한 학생을 위한 별빛 후디.' },
  { id: 'galaxy_cape', name: 'Galaxy Cape', emoji: '🦸', price: 260, type: 'Outfit', rarity: 'Epic', minLevel: 15, desc: '은하수 망토.' },
  { id: 'study_sweater', name: 'Study Sweater', emoji: '🧣', price: 190, type: 'Outfit', rarity: 'Rare', minLevel: 8, desc: '따뜻한 공부 스웨터.' },
  { id: 'pilot_jacket', name: 'Pilot Jacket', emoji: '🧥', price: 240, type: 'Outfit', rarity: 'Epic', minLevel: 20, desc: '우주 파일럿 재킷.' },
  { id: 'midnight_cloak', name: 'Midnight Cloak', emoji: '🌃', price: 360, type: 'Outfit', rarity: 'Legendary', minLevel: 40, desc: '깊은 밤 우주 망토.' },
  { id: 'fire_tail', name: 'Fire Tail', emoji: '🔥', price: 220, type: 'Tail', rarity: 'Epic', minLevel: 15, desc: '스트릭이 뜨거워 보이는 불꽃 꼬리.' },
  { id: 'ice_tail', name: 'Ice Tail', emoji: '❄️', price: 220, type: 'Tail', rarity: 'Epic', minLevel: 15, desc: '차분한 집중력을 보여주는 아이스 꼬리.' },
  { id: 'rainbow_tail', name: 'Rainbow Tail', emoji: '🌈', price: 360, type: 'Tail', rarity: 'Legendary', minLevel: 35, desc: '여러 색 별빛이 흐르는 꼬리.' },
  { id: 'aurora_tail', name: 'Aurora Tail', emoji: '🌌', price: 480, type: 'Tail', rarity: 'Legendary', minLevel: 45, desc: '오로라처럼 길게 퍼지는 꼬리.' },
  { id: 'meteor_tail', name: 'Meteor Tail', emoji: '☄️', price: 620, type: 'Tail', rarity: 'Mythic', minLevel: 70, desc: '전설급 유성 꼬리.' },
  { id: 'rocket', name: 'Tiny Rocket', emoji: '🚀', price: 140, type: 'Hand', rarity: 'Common', minLevel: 1, desc: '빠르게 성장하는 학생을 위한 작은 로켓.' },
  { id: 'english_book', name: 'English Book', emoji: '📘', price: 130, type: 'Hand', rarity: 'Common', minLevel: 1, desc: '일기와 피드백을 좋아하는 학생 아이템.' },
  { id: 'coffee', name: 'Study Coffee', emoji: '☕', price: 110, type: 'Hand', rarity: 'Common', minLevel: 1, desc: '성인 학생에게 잘 어울리는 집중 아이템.' },
  { id: 'star_pen', name: 'Star Pen', emoji: '🖊️', price: 160, type: 'Hand', rarity: 'Rare', minLevel: 5, desc: '좋은 문장을 남기기 위한 별빛 펜.' },
  { id: 'tiny_telescope', name: 'Tiny Telescope', emoji: '🔭', price: 240, type: 'Hand', rarity: 'Epic', minLevel: 20, desc: '다른 행성을 구경하는 망원경.' },
  { id: 'grammar_wand', name: 'Grammar Wand', emoji: '🪄', price: 330, type: 'Hand', rarity: 'Epic', minLevel: 30, desc: '문장을 더 자연스럽게 고쳐주는 마법봉.' },
  { id: 'moon_bg', name: 'Moon Room', emoji: '🌕', price: 250, type: 'Background', rarity: 'Epic', minLevel: 10, desc: '밤에 공부하는 느낌의 배경.' },
  { id: 'london_bg', name: 'London Street', emoji: '🇬🇧', price: 300, type: 'Background', rarity: 'Epic', minLevel: 15, desc: '영국 거리 분위기의 프로필 배경.' },
  { id: 'library_bg', name: 'Quiet Library', emoji: '📚', price: 240, type: 'Background', rarity: 'Rare', minLevel: 1, desc: '차분한 독서실 느낌의 배경.' },
  { id: 'nebula_bg', name: 'Nebula Window', emoji: '🌠', price: 420, type: 'Background', rarity: 'Legendary', minLevel: 35, desc: '성운이 보이는 창문 배경.' },
  { id: 'aurora_bg', name: 'Aurora Desk', emoji: '🌌', price: 520, type: 'Background', rarity: 'Legendary', minLevel: 45, desc: '오로라가 흐르는 공부방.' },
  { id: 'best_writer_badge', name: 'Best Writer Badge', emoji: '🏅', price: 400, type: 'Badge', rarity: 'Teacher Special', minLevel: 1, desc: '선생님이 특별히 주면 더 좋은 뱃지.' },
  { id: 'seven_day_badge', name: '7 Day Badge', emoji: '📅', price: 220, type: 'Badge', rarity: 'Rare', minLevel: 7, desc: '7일 스트릭 달성 기념 뱃지.' },
  { id: 'typing_runner_badge', name: 'Typing Runner', emoji: '⌨️', price: 260, type: 'Badge', rarity: 'Rare', minLevel: 10, desc: '타자 연습을 꾸준히 한 학생 뱃지.' },
  { id: 'feedback_collector', name: 'Feedback Collector', emoji: '📝', price: 320, type: 'Badge', rarity: 'Epic', minLevel: 20, desc: '피드백 복습을 많이 한 학생 뱃지.' },
  { id: 'galaxy_pioneer', name: 'Galaxy Pioneer', emoji: '🚩', price: 560, type: 'Badge', rarity: 'Legendary', minLevel: 50, desc: '우주 확장에 많이 기여한 학생 뱃지.' },
  { id: 'moon_cat', name: 'Moon Cat', emoji: '🐈‍⬛', price: 360, type: 'Pet', rarity: 'Epic', minLevel: 12, desc: '행성 주변을 따라다니는 달빛 고양이.' },
  { id: 'rocket_puppy', name: 'Rocket Puppy', emoji: '🐶', price: 360, type: 'Pet', rarity: 'Epic', minLevel: 12, desc: 'Comet Buddy 옆을 지키는 작은 로켓 강아지.' },
  { id: 'book_bunny', name: 'Book Bunny', emoji: '🐰', price: 320, type: 'Pet', rarity: 'Rare', minLevel: 8, desc: '책을 좋아하는 작은 토끼.' },
  { id: 'grammar_ghost', name: 'Grammar Ghost', emoji: '👻', price: 390, type: 'Pet', rarity: 'Epic', minLevel: 18, desc: '자주 틀리는 문장을 조용히 알려주는 유령.' },
  { id: 'star_whale', name: 'Star Whale', emoji: '🐋', price: 780, type: 'Pet', rarity: 'Mythic', minLevel: 70, desc: '은하를 헤엄치는 전설 펫.' },
  { id: 'soft_aura', name: 'Soft Aura', emoji: '💫', price: 260, type: 'Aura', rarity: 'Rare', minLevel: 1, desc: '캐릭터 주변을 부드럽게 빛나게 해요.' },
  { id: 'galaxy_aura', name: 'Galaxy Aura', emoji: '🌌', price: 520, type: 'Aura', rarity: 'Legendary', minLevel: 35, desc: '고레벨 커멧에게 어울리는 은하 오라.' },
  { id: 'sunrise_aura', name: 'Sunrise Aura', emoji: '🌅', price: 320, type: 'Aura', rarity: 'Epic', minLevel: 15, desc: '따뜻한 아침 별빛 오라.' },
  { id: 'focus_aura', name: 'Focus Aura', emoji: '🎯', price: 360, type: 'Aura', rarity: 'Epic', minLevel: 22, desc: '공부 집중력이 느껴지는 선명한 오라.' },
  { id: 'royal_aura', name: 'Royal Aura', emoji: '👑', price: 850, type: 'Aura', rarity: 'Mythic', minLevel: 80, desc: '레벨 높은 학생을 돋보이게 하는 왕실 오라.' },
  { id: 'study_frame', name: 'Study Frame', emoji: '🖼️', price: 220, type: 'Frame', rarity: 'Rare', minLevel: 1, desc: '프로필을 차분한 공부 느낌으로 꾸며요.' },
  { id: 'purple_orbit_frame', name: 'Purple Orbit Frame', emoji: '🟣', price: 280, type: 'Frame', rarity: 'Rare', minLevel: 10, desc: '보라 궤도 프레임.' },
  { id: 'rose_diary_frame', name: 'Rose Diary Frame', emoji: '🌹', price: 300, type: 'Frame', rarity: 'Epic', minLevel: 18, desc: '따뜻한 일기장 느낌의 프레임.' },
  { id: 'legend_frame', name: 'Legend Frame', emoji: '🏆', price: 700, type: 'Frame', rarity: 'Legendary', minLevel: 60, desc: '고레벨 전용 레전드 프레임.' },
  { id: 'first_planet_seed', name: 'Planet Seed', emoji: '🌱', price: 300, type: 'Planet', rarity: 'Rare', minLevel: 20, desc: 'Level 20 이후 행성 성장에 사용할 수 있는 씨앗.' },
  { id: 'planet_ring_gold', name: 'Golden Planet Ring', emoji: '🪐', price: 650, type: 'Planet', rarity: 'Epic', minLevel: 30, desc: '내 행성에 금빛 고리를 추가해요.' },
  { id: 'planet_tree', name: 'Starlight Tree', emoji: '🌳', price: 420, type: 'Planet', rarity: 'Epic', minLevel: 30, desc: '행성 위에 별빛 나무를 심어요.' },
  { id: 'crystal_cluster', name: 'Crystal Cluster', emoji: '🔮', price: 520, type: 'Planet', rarity: 'Epic', minLevel: 35, desc: '행성에 수정 군락을 추가해요.' },
  { id: 'mini_moon', name: 'Mini Moon', emoji: '🌙', price: 560, type: 'Planet', rarity: 'Epic', minLevel: 35, desc: '내 행성 주변에 작은 달을 띄워요.' },
  { id: 'cloud_ring', name: 'Cloud Ring', emoji: '☁️', price: 470, type: 'Planet', rarity: 'Rare', minLevel: 25, desc: '행성 둘레에 부드러운 구름 고리를 둘러요.' },
  { id: 'aurora_lake', name: 'Aurora Lake', emoji: '🏞️', price: 720, type: 'Planet', rarity: 'Legendary', minLevel: 45, desc: '행성 표면에 오로라 호수를 만들어요.' },
  { id: 'meteor_garden', name: 'Meteor Garden', emoji: '🌠', price: 840, type: 'Planet', rarity: 'Legendary', minLevel: 55, desc: '유성 조각으로 만든 작은 정원.' },
  { id: 'galaxy_core', name: 'Galaxy Core', emoji: '🌀', price: 1200, type: 'Planet', rarity: 'Mythic', minLevel: 80, desc: '행성 중심에 은하핵을 심어요.' },
  { id: 'moon_chair', name: 'Moon Chair', emoji: '🌙', price: 300, type: 'Room', rarity: 'Rare', minLevel: 10, desc: '홈 화면에 둘 수 있는 달 의자.' },
  { id: 'cloud_desk', name: 'Cloud Desk', emoji: '☁️', price: 320, type: 'Room', rarity: 'Rare', minLevel: 12, desc: '구름 위 공부 책상.' },
  { id: 'campfire_seat', name: 'Campfire Seat', emoji: '🔥', price: 360, type: 'Room', rarity: 'Epic', minLevel: 18, desc: '우주 캠프파이어 자리.' },
  { id: 'library_corner', name: 'Library Corner', emoji: '📚', price: 420, type: 'Room', rarity: 'Epic', minLevel: 25, desc: '작은 행성 도서관 코너.' },
  { id: 'observatory', name: 'Observatory', emoji: '🔭', price: 760, type: 'Room', rarity: 'Legendary', minLevel: 50, desc: '행성 위 관측소.' },
  { id: 'offline_party_badge', name: 'Offline Party Badge', emoji: '🎉', price: 9999, type: 'Badge', rarity: 'Teacher Special', minLevel: 1, desc: '오프라인 모임 참가자에게만 지급되는 특별 뱃지.' },
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
  reviewedExpressions: ['I see what you mean.'],
  typingRecords: [
    { id: 't1', wpm: 38, accuracy: 96, seconds: 42, completed: true, createdAt: dayjs().subtract(1, 'day').toISOString() },
    { id: 't2', wpm: 32, accuracy: 92, seconds: 55, completed: true, createdAt: dayjs().subtract(3, 'day').toISOString() },
  ],
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


export const feedbackTemplates = [
  { id: 'diary_basic', label: 'Diary correction', fields: ['Corrected sentence', 'Natural version', 'Useful expression', 'Teacher comment'] },
  { id: 'toefl', label: 'TOEFL writing', fields: ['Grammar', 'Logic', 'TOEFL style', 'Idea feedback'] },
  { id: 'childcare', label: 'Childcare English', fields: ['Corrected version', 'Natural educator version', 'Key sentence'] },
]

export const betaReadinessItems = [
  'Mobile login and invite flow',
  'Student diary flow',
  'Teacher feedback queue',
  'Wardrobe and shop flow',
  'Universe and planet preview',
  'Growth report preview',
]

export const starlightRules = [
  { action: 'Write a diary', reward: 10 },
  { action: 'Submit homework', reward: 15 },
  { action: 'Complete typing practice', reward: 5 },
  { action: 'Review feedback expression', reward: 5 },
  { action: 'Complete daily mission', reward: 10 },
  { action: 'Complete weekly quest', reward: 60 },
]
