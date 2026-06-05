import { useEffect, useMemo, useState } from 'react'
import { IconCheck, IconHanger, IconRefresh, IconShirt, IconX } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import CometAvatar from '../components/CometAvatar'
import { shopItems } from '../data/content'
import { useAppStore } from '../store/useAppStore'

const categories = ['Hat', 'Face', 'Outfit', 'Tail', 'Hand', 'Background', 'Badge', 'Pet', 'Aura', 'Frame']
const categoryLabels = {
  Hat: '모자', Face: '얼굴', Outfit: '의상', Tail: '꼬리', Hand: '손 아이템', Background: '배경', Badge: '뱃지', Pet: '펫', Aura: '오라', Frame: '프레임'
}

export default function WardrobePage() {
  const { user, setEquippedItems } = useAppStore()
  const [filter, setFilter] = useState('All')
  const [draftEquipped, setDraftEquipped] = useState(user.equipped || [])
  const ownedItems = useMemo(() => shopItems.filter(item => user.owned?.includes(item.id) && categories.includes(item.type)), [user.owned])
  const equippedItems = useMemo(() => shopItems.filter(item => draftEquipped?.includes(item.id)), [draftEquipped])
  const savedEquippedItems = useMemo(() => shopItems.filter(item => user.equipped?.includes(item.id)), [user.equipped])
  const filtered = filter === 'All' ? ownedItems : filter === 'Equipped' ? equippedItems : ownedItems.filter(item => item.type === filter)
  const isDirty = JSON.stringify([...(user.equipped || [])].sort()) !== JSON.stringify([...(draftEquipped || [])].sort())

  useEffect(() => {
    setDraftEquipped(user.equipped || [])
  }, [user.equipped])

  const previewItem = item => {
    const sameTypeIds = shopItems.filter(product => product.type === item.type).map(product => product.id)
    const kept = (draftEquipped || []).filter(id => !sameTypeIds.includes(id))
    setDraftEquipped([...kept, item.id])
  }
  const unequipTypeDraft = type => {
    const sameTypeIds = shopItems.filter(product => product.type === type).map(product => product.id)
    setDraftEquipped((draftEquipped || []).filter(id => !sameTypeIds.includes(id)))
  }
  const clearAll = () => setDraftEquipped([])
  const revert = () => setDraftEquipped(user.equipped || [])
  const save = () => setEquippedItems(draftEquipped)

  return (
    <div className="wardrobe-page page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">My Wardrobe</p>
          <h1>내 캐릭터 꾸미기</h1>
          <p>아이템을 누르면 먼저 미리보기로 적용돼요. 마음에 들면 저장하고, 아니면 되돌릴 수 있어요.</p>
        </div>
        <div className="header-actions wardrobe-header-actions">
          <button className="secondary-button" onClick={revert} disabled={!isDirty}><IconRefresh size={18} /> 되돌리기</button>
          <button className="secondary-button danger-soft" onClick={clearAll}><IconX size={18} /> 모두 벗기</button>
          <button className="primary-button" onClick={save} disabled={!isDirty}><IconCheck size={18} /> 저장하기</button>
        </div>
      </div>

      <section className="wardrobe-layout upgraded-wardrobe live-wardrobe-layout">
        <aside className="wardrobe-preview panel sticky-preview live-preview-panel">
          <div className="panel-title"><h2>{user.cometName}</h2><span>{isDirty ? '미리보기 중' : '저장된 모습'}</span></div>
          <CometAvatar equipped={draftEquipped} level={user.level} preview />
          <div className="preview-save-bar">
            <button className="primary-button" onClick={save} disabled={!isDirty}><IconCheck size={18} /> 이 모습 저장</button>
            <button className="secondary-button" onClick={revert} disabled={!isDirty}>저장된 모습으로</button>
          </div>
          <div className="tail-growth-note">
            <strong>실시간 미리보기</strong>
            <span>장착 전에도 바로 확인할 수 있어요. 카테고리별 ‘없음’을 누르면 해당 파츠만 벗겨집니다.</span>
          </div>
          <div className="equipped-list live-equipped-list">
            {categories.map(type => {
              const item = shopItems.find(product => product.type === type && draftEquipped?.includes(product.id))
              const saved = shopItems.find(product => product.type === type && user.equipped?.includes(product.id))
              return <div key={type} className={item?.id !== saved?.id ? 'changed' : ''}><strong>{categoryLabels[type] || type}</strong><span>{item ? `${item.emoji} ${item.name}` : '없음'}</span><button onClick={() => unequipTypeDraft(type)}>벗기</button></div>
            })}
          </div>
        </aside>

        <section className="panel wardrobe-items live-wardrobe-items">
          <div className="panel-title"><h2>내 아이템</h2><span>{ownedItems.length} owned · {savedEquippedItems.length} equipped</span></div>
          <div className="filter-pills wardrobe-tabs">
            {['All', 'Equipped', ...categories].map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category === 'All' ? '전체' : category === 'Equipped' ? '장착 중' : categoryLabels[category] || category}</button>)}
          </div>
          {filter !== 'All' && filter !== 'Equipped' && <button className="none-option-card" onClick={() => unequipTypeDraft(filter)}><span>🚫</span><strong>{categoryLabels[filter] || filter} 없음</strong><em>이 카테고리만 벗기기</em></button>}
          <div className="owned-item-grid live-owned-grid">
            {filtered.length === 0 && <div className="empty-state"><IconHanger size={28} /><strong>아직 이 카테고리의 아이템이 없어요.</strong><p>상점에서 아이템을 구매하거나 Comet Box를 열어보세요.</p></div>}
            {filtered.map(item => {
              const previewing = draftEquipped?.includes(item.id)
              const saved = user.equipped?.includes(item.id)
              return <article key={item.id} className={`owned-item-card ${previewing ? 'equipped previewing' : ''} ${saved ? 'saved-equipped' : ''}`}>
                <div className="shop-emoji">{item.emoji}</div>
                <div><h3>{item.name}</h3><p>{item.desc}</p><span>{item.type} · {item.rarity}</span>{previewing && !saved && <small>미리보기 중</small>}{saved && <small>저장된 장착</small>}</div>
                {previewing
                  ? <button className="secondary-button" onClick={() => unequipTypeDraft(item.type)}><IconX size={18} /> 벗기</button>
                  : <button className="primary-button" onClick={() => { previewItem(item); toast('미리보기로 적용했어요. 마음에 들면 저장하세요.') }}><IconShirt size={18} /> 미리보기</button>}
              </article>
            })}
          </div>
        </section>
      </section>
    </div>
  )
}
