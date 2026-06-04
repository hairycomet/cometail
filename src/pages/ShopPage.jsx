import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconHanger, IconLock, IconShoppingBag, IconSparkles } from '@tabler/icons-react'
import { shopItems } from '../data/content'
import { useAppStore } from '../store/useAppStore'

const categoryLabels = {
  All: '전체', Boost: '부스트', Community: '커뮤니티', 'Gift Box': '박스', Hat: '모자', Face: '얼굴', Outfit: '의상', Tail: '꼬리', Hand: '손 아이템', Background: '배경', Badge: '뱃지', Pet: '펫', Aura: '오라', Frame: '프레임', Planet: '행성', Room: '공간',
}

export default function ShopPage() {
  const { user, buyItem } = useAppStore()
  const [filter, setFilter] = useState('All')
  const [view, setView] = useState('all')
  const categories = ['All', ...new Set(shopItems.map(item => item.type))]
  const filtered = useMemo(() => {
    let items = filter === 'All' ? shopItems : shopItems.filter(item => item.type === filter)
    if (view === 'owned') items = items.filter(item => user.owned?.includes(item.id))
    if (view === 'available') items = items.filter(item => (!user.owned?.includes(item.id) || item.type === 'Gift Box') && Number(user.level || 1) >= Number(item.minLevel || 1))
    if (view === 'locked') items = items.filter(item => Number(user.level || 1) < Number(item.minLevel || 1))
    return items.sort((a, b) => Number(a.minLevel || 1) - Number(b.minLevel || 1) || Number(a.price || 0) - Number(b.price || 0))
  }, [filter, view, user.owned, user.level])

  return (
    <div className="page-stack shop-page upgraded-shop-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Starlight Shop</p>
          <h1>상점</h1>
          <p>아이템은 그냥 사는 것이 아니라, 레벨과 기록을 쌓으며 하나씩 열리는 작은 보상이에요. 잠긴 아이템도 미리 보면서 다음 목표를 정해보세요.</p>
        </div>
        <div className="header-actions">
          <Link className="secondary-button" to="/wardrobe"><IconHanger size={18} /> 내 아이템 보기</Link>
          <div className="point-chip large"><IconSparkles size={18} /> {user.points} Starlight</div>
        </div>
      </div>
      <div className="shop-summary-strip">
        <span>Level {user.level}</span><span>{shopItems.length} total items</span><span>{user.owned?.length || 0} owned</span><span>{shopItems.filter(item => Number(user.level || 1) < Number(item.minLevel || 1)).length} locked</span>
      </div>
      <div className="filter-pills view-pills"><button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>전체</button><button className={view === 'available' ? 'active' : ''} onClick={() => setView('available')}>구매 가능</button><button className={view === 'owned' ? 'active' : ''} onClick={() => setView('owned')}>보유 중</button><button className={view === 'locked' ? 'active' : ''} onClick={() => setView('locked')}>잠김</button></div>
      <div className="filter-pills category-scroll">{categories.map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{categoryLabels[category] || category}</button>)}</div>
      <div className="shop-grid expanded-shop-grid">
        {filtered.map(item => {
          const owned = user.owned?.includes(item.id)
          const locked = Number(user.level || 1) < Number(item.minLevel || 1)
          return (
            <article className={`shop-card rarity-${item.rarity?.toLowerCase().replaceAll(' ', '-')} ${locked ? 'locked-item' : ''}`} key={item.id}>
              {locked && <div className="lock-ribbon"><IconLock size={14} /> Lv.{item.minLevel}</div>}
              <div className="shop-emoji">{item.emoji}</div>
              <div className="item-meta"><span>{categoryLabels[item.type] || item.type}</span><b>{item.rarity}</b></div>
              <h2>{item.name}</h2>
              <p>{item.desc}</p>
              <strong>{item.price} Starlight</strong>
              {owned && item.type !== 'Gift Box'
                ? <Link className="secondary-button" to="/wardrobe">Wardrobe에서 장착</Link>
                : <button className="primary-button" disabled={locked} onClick={() => buyItem(item.id)}>{locked ? <IconLock size={18} /> : <IconShoppingBag size={18} />} {locked ? `Level ${item.minLevel} 해금` : item.type === 'Gift Box' ? '열기' : '구매'}</button>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
