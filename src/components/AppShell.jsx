import { Outlet, Link } from 'react-router-dom'
import { IconSparkles, IconMoonStars, IconSun } from '@tabler/icons-react'
import BottomNav from './BottomNav'
import { useAppStore } from '../store/useAppStore'

export default function AppShell() {
  const { user, theme, toggleTheme } = useAppStore()
  return (
    <div className={`pair-app ${theme}`}>
      <header className="pair-topbar">
        <Link to="/" className="pair-brand"><span className="pair-logo">☄</span><span>Cometail</span></Link>
        <div className="pair-top-actions">
          <span className="light-pill"><IconSparkles size={15} /> {user.points || 0}</span>
          <button className="round-icon" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <IconSun size={18}/> : <IconMoonStars size={18}/>}</button>
        </div>
      </header>
      <main className="pair-screen"><Outlet /></main>
      <BottomNav />
    </div>
  )
}
