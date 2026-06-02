import { useMemo, useState } from 'react'
import { IconHanger, IconRefresh, IconShirt, IconX } from '@tabler/icons-react'
import CometAvatar from '../components/CometAvatar'
import { shopItems } from '../data/content'
import { useAppStore } from '../store/useAppStore'

const categories = ['Hat', 'Face', 'Outfit', 'Tail', 'Hand', 'Background', 'Badge', 'Pet', 'Aura', 'Frame']

export default function WardrobePage() {
  const { user, equipItem, unequipType, resetEquipped } = useAppStore()
  const [filter, setFilter] = useState('All')
  const ownedItems = useMemo(() => shopItems.filter(item => user.owned?.includes(item.id) && categories.includes(item.type)), [user.owned])
  const equippedItems = useMemo(() => shopItems.filter(item => user.equipped?.includes(item.id)), [user.equipped])
  const filtered = filter === 'All' ? ownedItems : filter === 'Equipped' ? equippedItems : ownedItems.filter(item => item.type === filter)

  return (
    <div className="wardrobe-page page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">My Wardrobe</p>
          <h1>내 캐릭터 꾸미기</h1>
          <p>상점에서 산 아이템을 여기서 장착해요. 홈에 돌아가지 않아도 Comet Buddy의 변화를 바로 볼 수 있어요.</p>
        </div>
        <button className="secondary-button danger-soft" onClick={resetEquipped}><IconRefresh size={18} /> 전체 기본값</button>
      </div>

      <section className="wardrobe-layout upgraded-wardrobe">
        <aside className="wardrobe-preview panel sticky-preview">
          <div className="panel-title"><h2>{user.cometName}</h2><span>Level {user.level}</span></div>
          <CometAvatar equipped={user.equipped} level={user.level} preview />
          <div className="tail-growth-note">
            <strong>꼬리 성장</strong>
            <span>레벨이 오를수록 꼬리가 많아지고, 스트릭이 이어질수록 더 밝게 빛나요.</span>
          </div>
          <div className="equipped-list">
            {categories.map(type => {
              const item = shopItems.find(product => product.type === type && user.equipped?.includes(product.id))
              return <div key={type}><strong>{type}</strong><span>{item ? `${item.emoji} ${item.name}` : 'None'}</span><button onClick={() => unequipType(type)}>벗기</button></div>
            })}
          </div>
        </aside>

        <section className="panel wardrobe-items">
          <div className="panel-title"><h2>내 아이템</h2><span>{ownedItems.length} owned · {equippedItems.length} equipped</span></div>
          <div className="filter-pills wardrobe-tabs">
            {['All', 'Equipped', ...categories].map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}
          </div>
          <div className="owned-item-grid">
            {filtered.length === 0 && <div className="empty-state"><IconHanger size={28} /><strong>아직 이 카테고리의 아이템이 없어요.</strong><p>상점에서 아이템을 구매하거나 Comet Box를 열어보세요.</p></div>}
            {filtered.map(item => {
              const equipped = user.equipped?.includes(item.id)
              return <article key={item.id} className={`owned-item-card ${equipped ? 'equipped' : ''}`}>
                <div className="shop-emoji">{item.emoji}</div>
                <div><h3>{item.name}</h3><p>{item.desc}</p><span>{item.type} · {item.rarity}</span></div>
                {equipped
                  ? <button className="secondary-button" onClick={() => unequipType(item.type)}><IconX size={18} /> 벗기</button>
                  : <button className="primary-button" onClick={() => equipItem(item.id)}><IconShirt size={18} /> 장착하기</button>}
              </article>
            })}
          </div>
        </section>
      </section>
    </div>
  )
}
