import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconEyeOff, IconLock, IconMail, IconTicket } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'

export default function LoginPage(){
 const [mode,setMode]=useState('login'); const [show,setShow]=useState(false); const [form,setForm]=useState({email:'',password:'',confirm:'',inviteCode:''}); const [busy,setBusy]=useState(false)
 const {login,signup}=useAppStore(); const nav=useNavigate();
 const update=(k,v)=>setForm(s=>({...s,[k]:v}))
 const submit=async e=>{e.preventDefault(); if(mode==='signup'&&form.password!==form.confirm)return; setBusy(true); const ok=mode==='login'?await login(form):await signup(form); setBusy(false); if(ok)nav('/')}
 return <main className="auth-v16">
   <div className="auth-stars"/><div className="auth-orbit orbit-one"/><div className="auth-orbit orbit-two"/>
   <section className="auth-story">
     <div className="auth-wordmark"><span>☄</span> Cometail</div>
     <div className="auth-copy">
       <p className="eyebrow">INVITE-ONLY ENGLISH DIARY</p>
       <h1>둘이 써야<br/><em>열리는 오늘의 이야기</em></h1>
       <p>친구 또는 아직 모르는 누군가와 하루 한 문장씩.<br/>각자의 Comet을 키우고, 둘만의 우주를 함께 만들어요.</p>
       <div className="signal-preview"><span className="signal-dot mine">나</span><i/><span className="signal-dot mate">Mate</span><small>두 별빛이 도착하면 이야기가 열려요</small></div>
     </div>
   </section>
   <section className="auth-sheet">
    <div className="auth-tabs"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>로그인</button><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>회원가입</button></div>
    <div className="auth-heading"><h2>{mode==='login'?'다시 만나서 반가워요':'작은 우주에 초대받았어요'}</h2><p>{mode==='login'?'오늘의 별빛이 기다리고 있어요.':'초대코드를 확인하고 첫 신호를 보내보세요.'}</p></div>
    <form onSubmit={submit} className="auth-form-v16">
      <label><span><IconMail size={17}/> 이메일</span><input type="email" required value={form.email} onChange={e=>update('email',e.target.value)} placeholder="you@example.com"/></label>
      <label><span><IconLock size={17}/> 비밀번호</span><div className="password-wrap"><input type={show?'text':'password'} required minLength={6} value={form.password} onChange={e=>update('password',e.target.value)} placeholder="6자 이상"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<IconEyeOff size={18}/>:<IconEye size={18}/>}</button></div></label>
      {mode==='signup'&&<><label><span><IconLock size={17}/> 비밀번호 확인</span><input type={show?'text':'password'} required value={form.confirm} onChange={e=>update('confirm',e.target.value)} placeholder="한 번 더 입력"/></label><label><span><IconTicket size={17}/> 초대코드</span><input required value={form.inviteCode} onChange={e=>update('inviteCode',e.target.value)} placeholder="COMET-XXXX"/></label>{form.confirm&&form.password!==form.confirm&&<p className="form-error">비밀번호가 일치하지 않아요.</p>}</>}
      <button className="auth-submit" disabled={busy|| (mode==='signup'&&form.password!==form.confirm)}>{busy?'별빛 확인 중...':mode==='login'?'내 우주로 들어가기':'초대받은 우주 시작하기'}</button>
    </form>
    <p className="auth-private">Cometail은 초대받은 사람만 입장하는 프라이빗 베타예요.</p>
   </section>
 </main>
}
