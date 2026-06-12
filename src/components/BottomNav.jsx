import { NavLink } from 'react-router-dom'
import { IconHome2, IconPencilHeart, IconNotebook, IconPlanet, IconUserCircle } from '@tabler/icons-react'

const links = [
  { to: '/', label: 'Home', icon: IconHome2 },
  { to: '/diary/new', label: 'Write', icon: IconPencilHeart },
  { to: '/notebook', label: 'Notebook', icon: IconNotebook },
  { to: '/universe', label: 'Universe', icon: IconPlanet },
  { to: '/profile', label: 'My Comet', icon: IconUserCircle },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav v14-bottom-nav">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''} end={to === '/'}>
          <Icon size={21} stroke={2.25} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
