import { Link } from 'react-router-dom'
import { IconArrowRight, IconBell, IconLock, IconSparkles, IconStars } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { dailyQuestions } from '../data/pairContent'

export default function PairHomePage(){
 const {user,pair,todayEntry,sendNudge,connectDemoMate}=useAppStore(); const q=dailyQuestions.find(x=>x.id===todayEntry.questionId)||dailyQuestions[0]
 if(!pair) return <div className="empty-orbit-page"><div className="empty-planet">🪐</div><p className="eyebrow">YOUR ORBIT IS QUIET</p><h1>함께 쓸 Diary Mate를 만나볼까요?</h1><p>아는 사람을 초대하거나 새로운 별빛 신호를 찾아보세요.</p><Link className="primary-wide inline" to="/mate">Mate 찾기 <IconArrowRight size={18}/></Link><button className="ghost-button" onClick={connectDemoMate}>데모 Mate 연결하기</button></div>
 return <div className="home-v16">
  <section className="home-hero-v16">
    <div className="home-copy"><p className="eyebrow">DAY {pair.pairStreak} · {pair.stage.toUpperCase()}</p><h1>오늘도 두 별빛이<br/><em>같은 질문을 기다려요.</em></h1><p>{q.ko}</p><div className="home-actions"><Link to="/diary" className="primary-action">오늘의 답변 쓰기 <IconArrowRight size={19}/></Link><Link to="/universe" className="secondary-action">우리 우주 보기</Link></div></div>
    <div className="pair-visual"><div className={`comet-node mine ${todayEntry.mySubmitted?'lit':''}`}><span>☄</span><small>{user.nickname}</small></div><div className={`orbit-line ${todayEntry.unlocked?'complete':''}`}><i/><b>{todayEntry.unlocked?'OPEN':'LOCKED'}</b></div><div className={`comet-node mate ${todayEntry.mateSubmitted?'lit':''}`}><span>✦</span><small>{pair.mate?.nickname||'Waiting'}</small></div></div>
  </section>
  <section className="status-grid-v16">
    <article className="status-card"><div className="status-icon mine"><IconSparkles/></div><div><span>나의 별빛</span><strong>{todayEntry.mySubmitted?'도착 완료':'아직 작성 전'}</strong></div></article>
    <article className="status-card"><div className="status-icon mate"><IconStars/></div><div><span>Mate의 별빛</span><strong>{todayEntry.mateSubmitted?'도착 완료':'기다리는 중'}</strong></div>{todayEntry.mySubmitted&&!todayEntry.mateSubmitted&&<button className="tiny-action" onClick={sendNudge}><IconBell size={15}/> 신호</button>}</article>
    <article className="status-card wide"><div className="status-icon locked"><IconLock/></div><div><span>오늘의 이야기</span><strong>{todayEntry.unlocked?'두 답변이 열렸어요':'둘 다 써야 열려요'}</strong></div><Link to="/diary">확인하기</Link></article>
  </section>
  <section className="memory-strip"><div><p className="eyebrow">OUR GROWTH</p><h2>함께 만든 별빛</h2></div><div className="metric"><strong>{pair.pairStreak}</strong><span>Pair streak</span></div><div className="metric"><strong>{pair.constellationStars}</strong><span>Stars</span></div><div className="metric"><strong>{pair.pairLight}</strong><span>Pair light</span></div></section>
 </div>
}
