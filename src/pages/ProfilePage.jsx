import { useNavigate } from 'react-router-dom'
import { IconCopy, IconLogout, IconMedal2 } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import CometAvatar from '../components/CometAvatar'
import { useAppStore } from '../store/useAppStore'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, diaries, logout } = useAppStore()
  const copy = async () => { await navigator.clipboard.writeText(user.inviteCode); toast.success('초대코드 복사 완료') }
  return (
    <div className="profile-page">
      <section className="profile-card">
        <CometAvatar equipped={user.equipped} />
        <div><p className="eyebrow">My Cometail</p><h1>{user.nickname}</h1><p>{user.goal}</p><div className="badge-row"><span><IconMedal2 size={17} /> Level {user.level}</span><span>{user.streak} day streak</span><span>{diaries.length} diaries</span></div></div>
      </section>
      <section className="panel wide"><div className="panel-title"><h2>Private invite code</h2><button className="secondary-button" onClick={copy}><IconCopy size={18} /> Copy</button></div><div className="invite-code">{user.inviteCode}</div><p className="muted">Cometail은 초대코드로만 가입되는 작은 영어 학습 커뮤니티로 운영하는 것이 좋아요.</p></section>
      <button className="danger-button" onClick={() => { logout(); navigate('/login') }}><IconLogout size={18} /> 로그아웃</button>
    </div>
  )
}
