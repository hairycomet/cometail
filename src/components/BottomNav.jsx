import { NavLink } from 'react-router-dom'
import { IconHome2, IconPencilHeart, IconKeyboard, IconClipboardCheck, IconShoppingBag, IconUserCircle } from '@tabler/icons-react'

const links = [
  { to: '/', label: 'Home', icon: IconHome2 },
  { to: '/diary', label: 'Diary', icon: IconPencilHeart },
  { to: '/typing', label: 'Typing', icon: IconKeyboard },
  { to: '/homework', label: 'Tasks', icon: IconClipboardCheck },
  { to: '/shop', label: 'Shop', icon: IconShoppingBag },
  { to: '/profile', label: 'Profile', icon: IconUserCircle },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
          <Icon size={20} stroke={2.2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
