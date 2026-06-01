import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconHome, IconNotebook, IconKeyboard, IconChecklist, IconUser } from '@tabler/icons-react';

const NAV = [
  { path: '/home', icon: IconHome, label: 'Home' },
  { path: '/diary', icon: IconNotebook, label: 'Diary' },
  { path: '/typing', icon: IconKeyboard, label: 'Typing' },
  { path: '/homework', icon: IconChecklist, label: 'Tasks' },
  { path: '/profile', icon: IconUser, label: 'Profile' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      {NAV.map(({ path, icon: Icon, label }) => {
        const active = pathname.startsWith(path);
        return (
          <motion.button
            key={path}
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate(path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, padding: '10px 0 6px',
              position: 'relative',
            }}
          >
            {active && (
              <motion.div
                layoutId="navDot"
                style={{
                  position: 'absolute', top: 6, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--purple-600)',
                }}
              />
            )}
            <Icon
              size={22}
              stroke={active ? 2.5 : 1.5}
              color={active ? 'var(--purple-600)' : 'var(--text-tertiary)'}
            />
            <span style={{
              fontSize: 10,
              fontWeight: active ? 800 : 500,
              color: active ? 'var(--purple-600)' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-main)',
            }}>
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
