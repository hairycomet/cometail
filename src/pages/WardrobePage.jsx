import { useMemo, useState } from 'react'
import { IconHanger, IconShirt, IconX } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import { shopItems } from '../data/content'
import { useAppStore } from '../store/useAppStore'

const categories = ['Hat', 'Face', 'Outfit', 'Tail', 'Hand', 'Background', 'Badge']

export default function WardrobePage() {
  const { user, equipItem, unequipType } = useAppStore()
  const [filter, setFilter] = useState('Hat')
  const ownedItems = useMemo(() => shopItems.filter(item => user.owned?.includes(item.id) && categories.includes(item.type)), [user.owned])
  const filtered = ownedItems.filter(item => item.type === filter)

  return (
    <div className="wardrobe-page page-stack">
      <div className="page-header">
        <div><p className="eyebrow">My Wardrobe</p><h1>내 캐릭터 꾸미기</h1><p>내가 가진 아이템만 보고, 바로 장착하고, 필요하면 부위별로 벗을 수 있어요. 홈에 가지 않아도 이 화면에서 바로 확인됩니다.</p></div>
      </div>
      <section className="wardrobe-layout">
        <aside className="wardrobe-preview panel">
          <div className="panel-title"><h2>{user.cometName}</h2><span>Level {user.level}</span></div>
          <CometAvatar equipped={user.equipped} level={user.level} preview />
          <div className="equipped-list">
            {categories.map(type => {
              const item = shopItems.find(product => product.type === type && user.equipped?.includes(product.id))
              return <div key={type}><strong>{type}</strong><span>{item ? `${item.emoji} ${item.name}` : 'None'}</span></div>
            })}
          </div>
        </aside>
        <section className="panel wardrobe-items">
          <div className="panel-title"><h2>내 아이템</h2><button className="secondary-button" onClick={() => unequipType(filter)}><IconX size={18} /> {filter} 벗기</button></div>
          <div className="filter-pills wardrobe-tabs">{categories.map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
          <div className="owned-item-grid">
            {filtered.length === 0 && <div className="empty-state"><IconHanger size={28} /><strong>아직 가진 {filter} 아이템이 없어요.</strong><p>상점에서 아이템을 구매하거나 Comet Box를 열어보세요.</p></div>}
            {filtered.map(item => {
              const equipped = user.equipped?.includes(item.id)
              return <article key={item.id} className={`owned-item-card ${equipped ? 'equipped' : ''}`}>
                <div className="shop-emoji">{item.emoji}</div>
                <div><h3>{item.name}</h3><p>{item.desc}</p><span>{item.rarity}</span></div>
                <button className={equipped ? 'secondary-button' : 'primary-button'} onClick={() => equipItem(item.id)}><IconShirt size={18} /> {equipped ? '장착 중' : '장착하기'}</button>
              </article>
            })}
          </div>
        </section>
      </section>
    </div>
  )
}
