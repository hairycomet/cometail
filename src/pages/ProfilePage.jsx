import { useNavigate, Link } from 'react-router-dom'
import { IconBook2, IconCopy, IconGift, IconLogout, IconMedal2, IconSettings, IconTicket } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import CometAvatar from '../components/CometAvatar'
import { useAppStore } from '../store/useAppStore'
import { shopItems } from '../data/content'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, diaries, logout, generateInviteCode } = useAppStore()
  const copy = async value => { await navigator.clipboard.writeText(value); toast.success('복사 완료') }
  const ownedItems = shopItems.filter(item => user.owned?.includes(item.id))
  return (
    <div className="profile-page">
      <section className="profile-card enhanced-profile-card">
        <CometAvatar equipped={user.equipped} level={user.level} />
        <div>
          <p className="eyebrow">My Cometail</p>
          <h1>{user.nickname}</h1>
          <p>{user.goal || '나만의 영어 우주를 키우는 중이에요.'}</p>
          <div className="badge-row"><span><IconMedal2 size={17} /> Level {user.level}</span><span>{user.streak} day streak</span><span>{diaries.length} diaries</span><span>{user.goalType}</span></div>
          <div className="hero-actions"><Link className="secondary-button" to="/settings"><IconSettings size={18} /> 설정</Link><Link className="secondary-button" to="/notebook"><IconBook2 size={18} /> 피드백 보관함</Link></div>
        </div>
      </section>

      <section className="panel wide invite-ticket-panel">
        <div className="panel-title"><h2>초대권</h2><span>{user.inviteTickets || 0} ticket left</span></div>
        <div className="invite-ticket-layout">
          <div className="ticket-big"><IconTicket size={32} /><strong>{user.inviteTickets || 0}</strong><span>사용 가능한 초대권</span></div>
          <div>
            <p>Cometail은 초대받은 학생만 들어오는 프라이빗 영어 우주예요. 학생은 기본 초대권 1장을 받고, 생성된 코드는 한 번만 사용할 수 있어요.</p>
            <button className="primary-button" onClick={generateInviteCode} disabled={(user.inviteTickets || 0) < 1}><IconGift size={18} /> 친구 초대코드 만들기</button>
          </div>
        </div>
        {user.generatedInviteCodes?.length > 0 && <div className="generated-code-list">{user.generatedInviteCodes.map(code => <button key={code} onClick={() => copy(code)}><IconCopy size={16} /> {code}</button>)}</div>}
      </section>

      <section className="panel wide"><div className="panel-title"><h2>Owned items</h2><span>{ownedItems.length} items</span></div><div className="owned-grid">{ownedItems.map(item => <span key={item.id}>{item.emoji} {item.name}</span>)}</div></section>
      <section className="panel wide"><div className="panel-title"><h2>가입 참여코드</h2><button className="secondary-button" onClick={() => copy(user.inviteCode)}><IconCopy size={18} /> Copy</button></div><div className="invite-code">{user.inviteCode}</div><p className="muted">이 코드는 내가 가입할 때 사용한 코드예요. 새 친구 초대는 위 초대권으로 별도 코드를 만들어주세요.</p></section>
      <button className="danger-button" onClick={() => { logout(); navigate('/login') }}><IconLogout size={18} /> 로그아웃</button>
    </div>
  )
}
