import { useMemo, useState } from 'react'
import { IconShoppingBag, IconSparkles } from '@tabler/icons-react'
import { shopItems } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function ShopPage() {
  const { user, buyItem, equipItem } = useAppStore()
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(shopItems.map(item => item.type))]
  const filtered = useMemo(() => filter === 'All' ? shopItems : shopItems.filter(item => item.type === filter), [filter])
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="eyebrow">Point Shop</p><h1>상점</h1><p>포인트를 캐릭터 꾸미기, 배경, 뱃지, 스트릭 보호권으로 바꿔요. 아이템은 많을수록 학생들이 더 오래 머물러요.</p></div><div className="point-chip large"><IconSparkles size={18} /> {user.points}pt</div></div>
      <div className="filter-pills">{categories.map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
      <div className="shop-grid">
        {filtered.map(item => {
          const owned = user.owned?.includes(item.id)
          const equipped = user.equipped?.includes(item.id)
          return (
            <article className={`shop-card rarity-${item.rarity?.toLowerCase().replaceAll(' ', '-')}`} key={item.id}>
              <div className="shop-emoji">{item.emoji}</div>
              <div className="item-meta"><span>{item.type}</span><b>{item.rarity}</b></div>
              <h2>{item.name}</h2>
              <p>{item.desc}</p>
              <strong>{item.price}pt</strong>
              {owned && item.type !== 'Gift Box' ? <button className="secondary-button" onClick={() => equipItem(item.id)}>{equipped ? '장착 중' : '장착하기'}</button> : <button className="primary-button" onClick={() => buyItem(item.id)}><IconShoppingBag size={18} /> {item.type === 'Gift Box' ? '열기' : '구매'}</button>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
