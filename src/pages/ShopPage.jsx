import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconHanger, IconShoppingBag, IconSparkles } from '@tabler/icons-react'
import { shopItems } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function ShopPage() {
  const { user, buyItem } = useAppStore()
  const [filter, setFilter] = useState('All')
  const [view, setView] = useState('all')
  const categories = ['All', ...new Set(shopItems.map(item => item.type))]
  const filtered = useMemo(() => {
    let items = filter === 'All' ? shopItems : shopItems.filter(item => item.type === filter)
    if (view === 'owned') items = items.filter(item => user.owned?.includes(item.id))
    if (view === 'available') items = items.filter(item => !user.owned?.includes(item.id) || item.type === 'Gift Box')
    return items
  }, [filter, view, user.owned])
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="eyebrow">Starlight Shop</p><h1>상점</h1><p>상점은 구매하는 곳이고, 장착과 벗기는 Wardrobe에서 처리해요. 이렇게 나누면 훨씬 명확합니다.</p></div><div className="header-actions"><Link className="secondary-button" to="/wardrobe"><IconHanger size={18} /> 내 아이템 보기</Link><div className="point-chip large"><IconSparkles size={18} /> {user.points} Starlight</div></div></div>
      <div className="filter-pills view-pills"><button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>전체</button><button className={view === 'available' ? 'active' : ''} onClick={() => setView('available')}>구매 가능</button><button className={view === 'owned' ? 'active' : ''} onClick={() => setView('owned')}>보유 중</button></div>
      <div className="filter-pills">{categories.map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <div className="shop-grid">
        {filtered.map(item => {
          const owned = user.owned?.includes(item.id)
          return (
            <article className={`shop-card rarity-${item.rarity?.toLowerCase().replaceAll(' ', '-')}`} key={item.id}>
              <div className="shop-emoji">{item.emoji}</div>
              <div className="item-meta"><span>{item.type}</span><b>{item.rarity}</b></div>
              <h2>{item.name}</h2>
              <p>{item.desc}</p>
              <strong>{item.price} Starlight</strong>
              {owned && item.type !== 'Gift Box' ? <Link className="secondary-button" to="/wardrobe">Wardrobe에서 장착</Link> : <button className="primary-button" onClick={() => buyItem(item.id)}><IconShoppingBag size={18} /> {item.type === 'Gift Box' ? '열기' : '구매'}</button>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
