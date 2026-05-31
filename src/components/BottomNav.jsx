import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IconHome, IconNotebook, IconKeyboard,
  IconChecklist, IconUser,
} from '@tabler/icons-react';

const NAV_ITEMS = [
  { path: '/home', icon: IconHome, label: 'Home' },
  { path: '/diary', icon: IconNotebook, label: 'Diary' },
  { path: '/typing', icon: IconKeyboard, label: 'Typing' },
  { path: '/homework', icon: IconChecklist, label: 'Homework' },
  { path: '/profile', icon: IconUser, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 20px',
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <motion.button
            key={path}
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate(path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '4px 14px', background: 'none', position: 'relative',
            }}
          >
            {active && (
              <motion.div
                layoutId="navIndicator"
                style={{
                  position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                  width: 32, height: 3, borderRadius: 2,
                  background: 'linear-gradient(90deg, var(--purple-600), var(--purple-400))',
                }}
              />
            )}
            <Icon size={22} color={active ? 'var(--purple-600)' : 'var(--text-tertiary)'} stroke={active ? 2 : 1.5} />
            <span style={{
              fontSize: 10, fontWeight: active ? 800 : 500,
              color: active ? 'var(--purple-600)' : 'var(--text-tertiary)',
            }}>
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
