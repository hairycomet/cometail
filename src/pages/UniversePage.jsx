import { useMemo, useState } from 'react'
import { IconLock, IconPlanet, IconRocket, IconSparkles, IconStars, IconTree } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import { sampleStudents, shopItems, universeMilestones, universeReactions } from '../data/content'
import { useAppStore } from '../store/useAppStore'

function Planet({ student, mine, canCheer, cheers, onCheer }) {
  const size = Math.min(132, 54 + student.level * 1.65)
  const hasPlanet = student.level >= 20 || student.planet
  return (
    <article className={`planet-card tone-${student.themeColor || 'purple'} ${mine ? 'mine' : ''} ${hasPlanet ? 'has-planet' : 'comet-only'}`}>
      <div className="planet-orbit">
        <div className="planet-sphere" style={{ width: size, height: size }}><span>{hasPlanet ? '🪐' : '☄️'}</span></div>
        <CometAvatar size="small" equipped={mine ? student.equipped : []} level={student.level} />
      </div>
      <strong>{mine ? `${student.cometName} 나의 공간` : student.cometName}</strong>
      <span>Level {student.level} · {student.streak} day streak</span>
      <small>{student.planet || (hasPlanet ? 'Growing Planet' : 'Comet only')}</small>
      {canCheer && !mine && <div className="reaction-row">{universeReactions.slice(0, 3).map(reaction => {
        const done = cheers?.[`${student.id}-${reaction.id}`]
        return <button key={reaction.id} disabled={done} onClick={() => onCheer(student.id, reaction.id)}>{reaction.emoji}<span>{done ? 'Sent' : reaction.labelKo}</span></button>
      })}</div>}
    </article>
  )
}

export default function UniversePage() {
  const { user, students, investUniverse, investPlanet, cheerStudent, decoratePlanet, removePlanetDecor } = useAppStore()
  const [amount, setAmount] = useState(100)
  const canVisit = user.level >= 5
  const canLaunch = user.level >= 10
  const canPlanet = user.level >= 20
  const canDecorate = user.level >= 30
  const universeSize = 1 + Math.floor((user.universeInvestment || 0) / 300)
  const planetTier = Math.floor((user.planetInvestment || 0) / 500)
  const planetDecorItems = useMemo(() => shopItems.filter(item => ['Planet', 'Room'].includes(item.type) && user.owned?.includes(item.id)), [user.owned])
  const appliedDecor = useMemo(() => shopItems.filter(item => user.planetDecor?.includes(item.id)), [user.planetDecor])
  const myStudent = { ...user, name: user.nickname, planet: canPlanet ? (planetTier ? `Tier ${planetTier} Planet` : 'Small Planet Ready') : null }

  return (
    <div className="universe-page page-stack">
      <div className="page-header">
        <div><p className="eyebrow">Cometail Universe</p><h1>모두가 같은 우주에서 빛나는 공간</h1><p>처음에는 구경만 가능하고, 레벨이 오르면 내 커멧을 띄우고, 더 성장하면 나만의 행성과 장식을 만들 수 있어요.</p></div>
        <div className="point-chip large"><IconSparkles size={18} /> {user.points} Starlight</div>
      </div>

      <section className="universe-stage full-galaxy-stage">
        <div className="galaxy-cloud one" /><div className="galaxy-cloud two" /><div className="galaxy-cloud three" />
        <div className="universe-label"><IconStars size={18} /> Shared Galaxy · Size {universeSize}</div>
        {!canVisit && <div className="locked-overlay"><IconLock size={30} /><strong>Level 5부터 우주에 입장할 수 있어요.</strong><p>지금은 미리보기만 가능해요. 일기와 미션으로 별빛을 모아보세요.</p></div>}
        {canVisit && !canLaunch && <div className="floating-tip"><IconRocket size={18} /> Level 10부터 내 Comet을 공용 우주에 띄울 수 있어요.</div>}
        <div className={`planet-map ${!canVisit ? 'blurred' : ''}`}>
          <Planet student={myStudent} mine canCheer={false} cheers={user.universeCheers} onCheer={cheerStudent} />
          {students.filter(student => student.id !== user.uid).map(student => <Planet key={student.id} student={student} canCheer={canVisit} cheers={user.universeCheers} onCheer={cheerStudent} />)}
        </div>
      </section>

      <section className="universe-grid">
        <div className="panel investment-panel">
          <div className="panel-title"><h2>공용 우주 투자</h2><IconRocket size={20} /></div>
          <p className="muted">남는 Starlight를 공용 우주 확장에 투자해요. 이 투자는 모두가 같은 공간을 키운다는 느낌을 줍니다.</p>
          <label>투자할 별빛<input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="10" step="10" /></label>
          <button className="primary-button" onClick={() => investUniverse(amount)}>우주에 투자하기</button>
          <div className="investment-stat"><strong>{user.universeInvestment || 0}</strong><span>Universe investment</span></div>
        </div>
        <div className="panel investment-panel">
          <div className="panel-title"><h2>내 행성</h2><IconPlanet size={20} /></div>
          {!canPlanet ? <div className="empty-state"><IconLock size={28} /><strong>Level 20부터 행성을 만들 수 있어요.</strong><p>그 전까지는 우주 구경과 커멧 띄우기만 가능해요.</p></div> : <><p className="muted">행성은 장기 성장 목표예요. 투자할수록 행성 크기, 링, 위성, 장식이 해금됩니다.</p><button className="primary-button" onClick={() => investPlanet(amount)}>내 행성에 투자하기</button><div className="investment-stat"><strong>{user.planetInvestment || 0}</strong><span>Planet investment · Tier {planetTier}</span></div></>}
        </div>
      </section>

      <section className="panel wide planet-decoration-panel">
        <div className="panel-title"><h2>Planet Decorations</h2><span>{canDecorate ? 'Unlocked' : 'Level 30 required'}</span></div>
        <p className="muted">행성 꾸미기는 Level 30부터 본격적으로 열려요. 지금은 보유한 장식을 미리 확인할 수 있어요.</p>
        <div className="planet-decor-grid">
          {planetDecorItems.length === 0 && <div className="empty-state"><IconTree size={28} /><strong>아직 우주 장식이 없어요.</strong><p>상점에서 Planet 또는 Room 아이템을 구매해보세요.</p></div>}
          {planetDecorItems.map(item => {
            const applied = user.planetDecor?.includes(item.id)
            return <article key={item.id} className={applied ? 'applied' : ''}><span>{item.emoji}</span><strong>{item.name}</strong><p>{item.desc}</p>{applied ? <button className="secondary-button" onClick={() => removePlanetDecor(item.id)}>해제</button> : <button className="primary-button" disabled={!canDecorate && item.type === 'Planet'} onClick={() => decoratePlanet(item.id)}>적용</button>}</article>
          })}
        </div>
        {appliedDecor.length > 0 && <div className="applied-decor-row"><strong>적용 중</strong>{appliedDecor.map(item => <span key={item.id}>{item.emoji} {item.name}</span>)}</div>}
      </section>

      <section className="panel wide">
        <div className="panel-title"><h2>Universe milestones</h2><span>{canDecorate ? 'Planet decoration unlocked' : 'Keep growing'}</span></div>
        <div className="milestone-grid">
          {universeMilestones.map(milestone => <div key={milestone.level} className={user.level >= milestone.level ? 'unlocked' : 'locked'}><strong>Level {milestone.level}</strong><h3>{milestone.title}</h3><p>{milestone.desc}</p></div>)}
        </div>
      </section>
    </div>
  )
}
