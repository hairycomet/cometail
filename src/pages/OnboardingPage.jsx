import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconFriends, IconSparkles, IconUserHeart, IconUser } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'

export default function OnboardingPage(){
 const [step,setStep]=useState(0); const [form,setForm]=useState({nickname:'',cometName:'',adultConfirmed:false,startMode:'',genderPreference:'any',vibe:'English habit friend'})
 const completeOnboarding=useAppStore(s=>s.completeOnboarding); const nav=useNavigate()
 const next=()=>setStep(v=>v+1)
 const finish=async()=>{await completeOnboarding(form);nav('/')}
 return <main className="onboarding-v16">
  <div className="onboarding-card">
   <div className="onboarding-progress"><span style={{width:`${(step+1)/3*100}%`}}/></div>
   {step===0&&<section><div className="onboarding-icon">☄</div><p className="eyebrow">WELCOME SIGNAL</p><h1>당신의 Comet은<br/>어떤 이름으로 빛날까요?</h1><label>다른 사람에게 보일 닉네임<input value={form.nickname} onChange={e=>setForm({...form,nickname:e.target.value})} placeholder="예: Comet"/></label><label>내가 키울 Comet의 이름<input value={form.cometName} onChange={e=>setForm({...form,cometName:e.target.value})} placeholder="예: Lumi"/></label><button className="primary-wide" disabled={!form.nickname||!form.cometName} onClick={next}>다음 <IconArrowRight size={18}/></button></section>}
   {step===1&&<section><p className="eyebrow">CHOOSE YOUR ORBIT</p><h1>어떻게 시작할까요?</h1><div className="choice-grid"><button className={form.startMode==='friend'?'selected':''} onClick={()=>setForm({...form,startMode:'friend'})}><IconFriends/><strong>아는 사람과 시작</strong><span>페어 코드를 보내 둘만의 우주를 만들어요.</span></button><button className={form.startMode==='anonymous'?'selected':''} onClick={()=>setForm({...form,startMode:'anonymous'})}><IconUserHeart/><strong>새로운 Mate 만나기</strong><span>익명으로 연결되어 매일 서로를 알아가요.</span></button><button className={form.startMode==='solo'?'selected':''} onClick={()=>setForm({...form,startMode:'solo'})}><IconUser/><strong>우선 혼자 시작</strong><span>혼자 기록하다가 나중에 Mate를 찾을 수 있어요.</span></button></div><button className="primary-wide" disabled={!form.startMode} onClick={next}>다음 <IconArrowRight size={18}/></button></section>}
   {step===2&&<section><p className="eyebrow">SAFE & GENTLE</p><h1>{form.startMode==='anonymous'?'새로운 연결을 준비해요':'마지막으로 확인해주세요'}</h1>{form.startMode==='anonymous'&&<><label>연결을 원하는 상대<select value={form.genderPreference} onChange={e=>setForm({...form,genderPreference:e.target.value})}><option value="any">성별 상관없음</option><option value="female">여성과 연결</option><option value="male">남성과 연결</option></select></label><label>원하는 관계 분위기<select value={form.vibe} onChange={e=>setForm({...form,vibe:e.target.value})}><option>English habit friend</option><option>편하게 이야기할 친구</option><option>새로운 사람 알아가기</option><option>친구 또는 연애 가능성 모두 열어두기</option></select></label></>}<label className="check-line"><input type="checkbox" checked={form.adultConfirmed} onChange={e=>setForm({...form,adultConfirmed:e.target.checked})}/><span>익명 매칭은 만 18세 이상이며, 안전 가이드에 동의해요.</span></label><button className="primary-wide" disabled={form.startMode==='anonymous'&&!form.adultConfirmed} onClick={finish}><IconSparkles size={18}/> 첫 별빛 보내기</button></section>}
  </div>
 </main>
}
