import { useMemo, useRef, useState } from 'react'
import {
  IconArrowRight,
  IconDice5,
  IconLock,
  IconMap2,
  IconPlanet,
  IconRocket,
  IconSparkles,
  IconStars,
  IconTree,
  IconUsers,
  IconX,
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import CometAvatar from '../components/CometAvatar'
import { getLevelStage, getNextLevelStage, levelStages, shopItems, universeReactions } from '../data/content'
import { useAppStore } from '../store/useAppStore'

const mapSlots = [
  { x: 48, y: 52, scale: 1.45 },
  { x: 20, y: 56, scale: .9 },
  { x: 38, y: 27, scale: .72 },
  { x: 62, y: 30, scale: .82 },
  { x: 78, y: 54, scale: .96 },
  { x: 31, y: 74, scale: .66 },
  { x: 58, y: 76, scale: .7 },
  { x: 86, y: 28, scale: .64 },
  { x: 15, y: 29, scale: .62 },
  { x: 72, y: 78, scale: .58 },
  { x: 90, y: 70, scale: .52 },
  { x: 43, y: 78, scale: .52 },
]

function progressToNext(value, unit) {
  const current = Number(value || 0)
  const step = Number(unit || 100)
  const inStep = current % step
  return { inStep, needed: step - inStep, pct: Math.min(100, Math.round((inStep / step) * 100)) }
}

function getPlanetTier(student) {
  const byInvestment = Math.floor(Number(student.planetInvestment || 0) / 500)
  const byLevel = student.level >= 100 ? 9 : student.level >= 80 ? 8 : student.level >= 70 ? 7 : student.level >= 60 ? 6 : student.level >= 50 ? 5 : student.level >= 40 ? 4 : student.level >= 30 ? 3 : student.level >= 20 ? 2 : student.level >= 10 ? 1 : 0
  return Math.max(byInvestment, byLevel)
}

function getGalaxySize(user) {
  return Math.max(1, 1 + Math.floor(Number(user.universeInvestment || 0) / 300))
}

function StudentNode({ student, mine, slot, onSelect }) {
  const stage = getLevelStage(student.level)
  const planetTier = getPlanetTier(student)
  const hasPlanet = Number(student.level || 1) >= 20 || planetTier > 1
  const isCometOnly = !hasPlanet
  const style = {
    left: `${slot.x}%`,
    top: `${slot.y}%`,
    '--node-scale': slot.scale,
    '--planet-tier': planetTier,
  }
  return (
    <button type="button" className={`universe-node ${mine ? 'mine' : ''} tier-${Math.min(9, planetTier)} level-band-${Math.min(10, Math.floor(Number(student.level || 1) / 10))} ${isCometOnly ? 'comet-only' : 'planet-ready'}`} style={style} onClick={() => onSelect(student)}>
      <span className="planet-halo" />
      <span className="free-planet-sphere"><span>{hasPlanet ? '🪐' : '☄️'}</span></span>
      <CometAvatar size="small" equipped={mine ? student.equipped : []} level={student.level} />
      <span className="node-name">{mine ? '👑 나의 행성' : student.cometName || student.nickname}</span>
      <small>Lv. {student.level} · {stage.planet}</small>
    </button>
  )
}

function VisitorPanel({ student, user, onClose, onCheer, onSavePattern }) {
  if (!student) return null
  const stage = getLevelStage(student.level)
  const next = getNextLevelStage(student.level)
  const planetTier = getPlanetTier(student)
  const mine = (student.uid || student.id) === user.uid
  return (
    <div className="visitor-backdrop" onClick={onClose}>
      <aside className="visitor-panel" onClick={event => event.stopPropagation()}>
        <button className="visitor-close" onClick={onClose}><IconX size={18} /></button>
        <div className="visitor-hero">
          <div className={`visitor-planet tier-${Math.min(9, planetTier)}`}><CometAvatar size="small" equipped={mine ? student.equipped : []} level={student.level} /></div>
          <div>
            <p className="eyebrow">{mine ? 'My Planet' : 'Visited Planet'}</p>
            <h2>{mine ? `${student.cometName} 나의 공간` : `${student.cometName || student.nickname}의 행성`}</h2>
            <p>Level {student.level} · {student.streak || 0} day streak · {stage.title}</p>
          </div>
        </div>
        <div className="visitor-stats">
          <div><strong>{stage.planet}</strong><span>현재 행성 단계</span></div>
          <div><strong>Tier {planetTier}</strong><span>Planet Tier</span></div>
          <div><strong>{student.totalEarned || student.points || 0}</strong><span>Total XP</span></div>
        </div>
        <div className="visitor-unlock-card">
          <strong>현재 보이는 차이</strong>
          <p>{stage.visual}</p>
          {next ? <small>다음 큰 변화: Level {next.level} · {next.unlock}</small> : <small>최고 단계의 Legendary Comet이에요.</small>}
        </div>
        {!mine && <div className="visitor-public-patterns"><strong>공개 문장 패턴</strong><p>일기 내용은 비공개여도, 친구가 공개한 문장 패턴은 저장해서 배울 수 있어요.</p>{(student.savedPatterns || []).filter(pattern => pattern.visibility !== 'private').slice(0, 4).map(pattern => <button key={pattern.id || pattern.pattern} onClick={() => onSavePattern(pattern)}><span>{pattern.pattern}</span><em>{pattern.meaning || pattern.example}</em></button>)}{!(student.savedPatterns || []).length && <small>아직 공개한 문장 패턴이 없어요.</small>}</div>}
        {!mine && <div className="reaction-row visitor-reactions">{universeReactions.map(reaction => <button key={reaction.id} onClick={() => onCheer(student.uid || student.id, reaction.id)}>{reaction.emoji}<span>{reaction.labelKo}</span></button>)}</div>}
        {mine && <div className="visitor-actions"><Link className="primary-button" to="/wardrobe">내 커멧 꾸미기</Link><Link className="secondary-button" to="/shop">행성 장식 사러가기</Link></div>}
      </aside>
    </div>
  )
}

export default function UniversePage() {
  const { user, students, isFirebaseMode, investUniverse, investPlanet, cheerStudent, decoratePlanet, removePlanetDecor, savePattern } = useAppStore()
  const [amount, setAmount] = useState(100)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null)
  const canVisit = user.level >= 5
  const canLaunch = user.level >= 10
  const canPlanet = user.level >= 20
  const canDecorate = user.level >= 30
  const universeSize = getGalaxySize(user)
  const universeProgress = progressToNext(user.universeInvestment, 300)
  const planetTier = getPlanetTier(user)
  const planetProgress = progressToNext(user.planetInvestment, 500)
  const currentStage = getLevelStage(user.level)
  const nextStage = getNextLevelStage(user.level)
  const planetDecorItems = useMemo(() => shopItems.filter(item => ['Planet', 'Room'].includes(item.type) && user.owned?.includes(item.id)), [user.owned])
  const appliedDecor = useMemo(() => shopItems.filter(item => user.planetDecor?.includes(item.id)), [user.planetDecor])
  const realPeers = useMemo(() => {
    return (students || [])
      .filter(student => student)
      .filter(student => (student.uid || student.id) !== user.uid)
      .filter(student => !isFirebaseMode || Boolean(student.uid))
      .sort((a, b) => Number(b.level || 0) - Number(a.level || 0))
  }, [students, user.uid, isFirebaseMode])
  const myStudent = { ...user, id: user.uid || 'me', name: user.nickname, planet: canPlanet ? currentStage.planet : null }
  const galaxyStudents = [myStudent, ...realPeers].slice(0, mapSlots.length)
  const randomVisit = () => {
    const pool = galaxyStudents.filter(Boolean)
    if (!pool.length) return
    const choice = pool[Math.floor(Math.random() * pool.length)]
    setSelectedStudent(choice)
  }
  const startDrag = event => {
    if (event.target.closest('.universe-node, button, a, input')) return
    dragRef.current = { startX: event.clientX, startY: event.clientY, x: pan.x, y: pan.y }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const moveDrag = event => {
    if (!dragRef.current) return
    const nextX = dragRef.current.x + event.clientX - dragRef.current.startX
    const nextY = dragRef.current.y + event.clientY - dragRef.current.startY
    setPan({ x: Math.max(-180, Math.min(180, nextX)), y: Math.max(-120, Math.min(120, nextY)) })
  }
  const endDrag = () => { dragRef.current = null }
  const resetMap = () => setPan({ x: 0, y: 0 })

  return (
    <div className="universe-page page-stack hybrid-universe-page">
      <div className="page-header universe-page-title">
        <div><p className="eyebrow">Cometail Universe</p><h1>모두가 빛나는 공유 우주 공간</h1><p>행성은 줄 세워진 카드가 아니라, 같은 우주 안에 자유롭게 떠 있어요. 친구의 행성을 눌러 구경하고, 랜덤 방문으로 새로운 커멧을 만나보세요.</p></div>
        <div className="header-actions"><button className="secondary-button" onClick={randomVisit}><IconDice5 size={18} /> 랜덤 우주 여행</button><div className="point-chip large"><IconSparkles size={18} /> {user.points} Starlight</div></div>
      </div>

      <section className={`shared-universe-map galaxy-size-${Math.min(6, universeSize)} planet-tier-${Math.min(9, planetTier)} ${!canVisit ? 'locked-preview' : ''}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <div className="space-grid-line" /><div className="space-nebula nebula-a" /><div className="space-nebula nebula-b" /><div className="space-core" />
        <div className="map-topbar"><div><span className="universe-label"><IconStars size={18} /> Shared Galaxy · Size {universeSize}</span><small>{galaxyStudents.length}명의 커멧이 함께 빛나고 있어요 · 빈 공간을 드래그해서 우주를 움직일 수 있어요</small></div><button className="ghost-button" onClick={resetMap}><IconMap2 size={18} /> 중심으로</button></div>
        {!canVisit && <div className="locked-overlay"><IconLock size={30} /><strong>Level 5부터 우주에 입장할 수 있어요.</strong><p>지금은 미리보기만 가능해요. 일기와 미션으로 별빛을 모아보세요.</p></div>}
        {canVisit && !canLaunch && <div className="floating-tip"><IconRocket size={18} /> Level 10부터 내 Comet을 공용 우주에 띄울 수 있어요.</div>}
        <div className="free-planet-map" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          {galaxyStudents.map((student, index) => <StudentNode key={student.uid || student.id || index} student={student} mine={(student.uid || student.id) === (user.uid || 'me')} slot={mapSlots[index]} onSelect={setSelectedStudent} />)}
        </div>
        {isFirebaseMode && realPeers.length === 0 && <div className="real-galaxy-note compact-note">아직 실제 가입한 학생이 거의 없어서 나의 행성이 중심에 보여요. 학생들이 들어오면 이곳에 실제 행성이 하나씩 떠오릅니다.</div>}
      </section>

      <section className="universe-status-grid">
        <div className="panel investment-panel upgraded-investment-card">
          <div className="panel-title"><h2>공용 우주 성장</h2><IconRocket size={20} /></div>
          <p className="muted">함께 투자할수록 공유 우주가 넓어지고, 더 많은 장식과 이벤트 공간이 열립니다.</p>
          <div className="investment-level-box"><strong>Shared Galaxy Lv. {universeSize}</strong><span>다음 확장까지 {universeProgress.needed} Starlight</span></div>
          <div className="progress-track investment-progress"><div style={{ width: `${universeProgress.pct}%` }} /></div>
          <label>투자할 별빛<input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="10" step="10" /></label>
          <button className="primary-button" onClick={() => investUniverse(amount)}>우주에 투자하기</button>
        </div>
        <div className="panel investment-panel upgraded-investment-card">
          <div className="panel-title"><h2>내 행성 성장</h2><IconPlanet size={20} /></div>
          {!canPlanet ? <div className="empty-state"><IconLock size={28} /><strong>Level 20부터 행성을 만들 수 있어요.</strong><p>Level {user.level} · 다음 큰 해금: {nextStage ? `Level ${nextStage.level} ${nextStage.unlock}` : 'Legendary 단계'}</p></div> : <><p className="muted">행성에 투자하면 크기, 링, 위성, 장식 슬롯이 단계적으로 열립니다.</p><div className="investment-level-box planet"><strong>Planet Tier {planetTier}</strong><span>다음 Tier까지 {planetProgress.needed} Starlight</span></div><div className="progress-track investment-progress planet"><div style={{ width: `${planetProgress.pct}%` }} /></div><button className="primary-button" onClick={() => investPlanet(amount)}>내 행성에 투자하기</button></>}
        </div>
        <div className="panel level-roadmap-panel">
          <div className="panel-title"><h2>레벨별 변화</h2><span>{currentStage.title}</span></div>
          <p className="muted">레벨이 오르면 숫자만 바뀌는 것이 아니라, 꼬리, 오라, 행성, 장식 슬롯이 계속 달라져요.</p>
          <div className="compact-level-roadmap">
            {levelStages.map(stage => <div key={stage.level} className={user.level >= stage.level ? 'unlocked' : 'locked'}><strong>Lv.{stage.level}</strong><span>{stage.unlock}</span></div>)}
          </div>
        </div>
      </section>

      <section className="panel wide planet-decoration-panel">
        <div className="panel-title"><h2>Planet Decorations</h2><span>{canDecorate ? 'Unlocked' : 'Level 30 required'}</span></div>
        <p className="muted">행성 꾸미기는 Level 30부터 본격적으로 열려요. Planet 또는 Room 아이템을 보유하면 이곳에서 행성에 적용할 수 있어요.</p>
        <div className="planet-decor-grid">
          {planetDecorItems.length === 0 && <div className="empty-state"><IconTree size={28} /><strong>아직 우주 장식이 없어요.</strong><p>상점에서 Planet 또는 Room 아이템을 구매하면 Level 30 이후 행성에 적용할 수 있어요.</p><Link className="secondary-button" to="/shop">상점에서 장식 보기 <IconArrowRight size={16} /></Link></div>}
          {planetDecorItems.map(item => {
            const applied = user.planetDecor?.includes(item.id)
            return <article key={item.id} className={applied ? 'applied' : ''}><span>{item.emoji}</span><strong>{item.name}</strong><p>{item.desc}</p>{applied ? <button className="secondary-button" onClick={() => removePlanetDecor(item.id)}>해제</button> : <button className="primary-button" disabled={!canDecorate && item.type === 'Planet'} onClick={() => decoratePlanet(item.id)}>적용</button>}</article>
          })}
        </div>
        {appliedDecor.length > 0 && <div className="applied-decor-row"><strong>적용 중</strong>{appliedDecor.map(item => <span key={item.id}>{item.emoji} {item.name}</span>)}</div>}
      </section>

      <VisitorPanel student={selectedStudent} user={user} onClose={() => setSelectedStudent(null)} onCheer={cheerStudent} onSavePattern={savePattern} />
    </div>
  )
}
