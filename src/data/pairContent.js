export const dailyQuestions = [
  {
    id: 'q-food-weekly',
    category: 'First Signal',
    question: 'What food could you eat every week?',
    ko: '매주 먹어도 질리지 않을 음식은 무엇인가요?',
    starter: 'I could eat _____ every week because _____.',
    photoPrompt: true,
    photoHint: '오늘 먹은 음식이나 좋아하는 간식 사진을 올려보세요.',
  },
  {
    id: 'q-small-happy',
    category: 'First Signal',
    question: 'What is one small thing that made you happy today?',
    ko: '오늘 나를 기분 좋게 한 작은 일은 무엇인가요?',
    starter: 'One small thing that made me happy was _____.',
    photoPrompt: false,
  },
  {
    id: 'q-sky',
    category: 'First Signal',
    question: 'What did the sky look like where you were today?',
    ko: '오늘 당신이 있던 곳의 하늘은 어땠나요?',
    starter: 'The sky looked _____ today.',
    photoPrompt: true,
    photoHint: '얼굴이나 위치 정보 없이 오늘의 하늘을 담아보세요.',
  },
  {
    id: 'q-relax',
    category: 'Orbit',
    question: 'What is your favorite way to relax?',
    ko: '가장 좋아하는 휴식 방법은 무엇인가요?',
    starter: 'My favorite way to relax is _____.',
    photoPrompt: false,
  },
  {
    id: 'q-comfortable-person',
    category: 'Orbit',
    question: 'What kind of person makes you feel comfortable?',
    ko: '어떤 사람과 함께 있을 때 편안함을 느끼나요?',
    starter: 'I feel comfortable with people who _____.',
    photoPrompt: false,
  },
  {
    id: 'q-memory',
    category: 'Starlight',
    question: 'What is a memory that always makes you smile?',
    ko: '생각하면 항상 미소가 나는 추억은 무엇인가요?',
    starter: 'A memory that always makes me smile is _____.',
    photoPrompt: true,
    photoHint: '그 추억을 떠올리게 하는 물건이나 장소를 담아보세요.',
  },
  {
    id: 'q-together',
    category: 'Connection',
    question: 'What is something we should try together someday?',
    ko: '언젠가 우리 둘이 함께 해보고 싶은 것은 무엇인가요?',
    starter: 'Someday, I think we should _____.',
    photoPrompt: false,
  },
]

export const quickReactions = [
  { id: 'same', emoji: '🌙', label: '나도 그래요' },
  { id: 'surprised', emoji: '✨', label: '의외예요' },
  { id: 'curious', emoji: '🔭', label: '더 궁금해요' },
  { id: 'remember', emoji: '💫', label: '기억하고 싶어요' },
  { id: 'lovely', emoji: '🧡', label: '오늘 답변이 좋아요' },
]

export const starterPairLooks = [
  { id: 'orbit-hoodie', name: 'Orbit Hoodie', left: '🌙', right: '⭐' },
  { id: 'sun-moon', name: 'Sun & Moon', left: '☀️', right: '🌙' },
  { id: 'split-star', name: 'Two Halves', left: '◐', right: '◑' },
]
