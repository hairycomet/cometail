import { IconShoppingBag, IconSparkles } from '@tabler/icons-react'
import { shopItems } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function ShopPage() {
  const { user, buyItem, equipItem } = useAppStore()
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="eyebrow">Point Shop</p><h1>상점</h1><p>일기와 숙제를 통해 얻은 포인트가 캐릭터 꾸미기와 학습 보상으로 이어집니다.</p></div><div className="point-chip large"><IconSparkles size={18} /> {user.points}pt</div></div>
      <div className="shop-grid">
        {shopItems.map(item => {
          const owned = user.owned?.includes(item.id)
          return (
            <article className="shop-card" key={item.id}>
              <div className="shop-emoji">{item.emoji}</div>
              <span>{item.type}</span>
              <h2>{item.name}</h2>
              <p>{item.desc}</p>
              <strong>{item.price}pt</strong>
              {owned ? <button className="secondary-button" onClick={() => equipItem(item.id)}>장착하기</button> : <button className="primary-button" onClick={() => buyItem(item.id)}><IconShoppingBag size={18} /> 구매</button>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
