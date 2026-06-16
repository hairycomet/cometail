import { NavLink } from 'react-router-dom'
import { IconHome2, IconBook2, IconHeartHandshake, IconPlanet, IconSparkles } from '@tabler/icons-react'
const links = [
  { to:'/', label:'Home', icon:IconHome2 },
  { to:'/diary', label:'Diary', icon:IconBook2 },
  { to:'/mate', label:'Mate', icon:IconHeartHandshake },
  { to:'/universe', label:'Our Universe', icon:IconPlanet },
  { to:'/me', label:'My Comet', icon:IconSparkles },
]
export default function BottomNav(){
 return <nav className="pair-bottom-nav">{links.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/' } className={({isActive})=>isActive?'active':''}><Icon size={21}/><span>{label}</span></NavLink>)}</nav>
}
