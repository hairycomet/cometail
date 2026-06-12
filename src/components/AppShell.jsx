import { Outlet, Link, useLocation } from 'react-router-dom'
import { IconMoonStars, IconSun, IconShieldStar, IconSettings, IconUserCircle, IconSparkles } from '@tabler/icons-react'
import BottomNav from './BottomNav'
import { useAppStore } from '../store/useAppStore'

export default function AppShell() {
  const { user, theme, toggleTheme } = useAppStore()
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className={`app v14-app ${theme} tone-${user.themeColor || 'purple'} mode-${user.displayMode || 'default'}`}>
      <header className="topbar v14-topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">☄️</span>
          <span>Cometail</span>
        </Link>
        <div className="topbar-actions">
          <Link className="teacher-pill" to="/profile"><IconUserCircle size={17} /> My Comet</Link>
          {user.isAdmin && <Link className={`teacher-pill ${isAdminPage ? 'active' : ''}`} to="/admin"><IconShieldStar size={17} /> Admin</Link>}
          <Link className="icon-button" to="/settings" aria-label="Settings"><IconSettings size={20} /></Link>
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <IconMoonStars size={20} /> : <IconSun size={20} />}
          </button>
          <div className="point-chip"><IconSparkles size={16} /> {user.points}</div>
        </div>
      </header>
      <main className="screen v14-screen">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
