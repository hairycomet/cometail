import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import MiniMe from '../components/MiniMe';
import { IconArrowLeft, IconStar } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ITEMS = {
  hats: [
    { id: 'hat_default', name: 'Cap', icon: '🎓', price: 0, owned: true },
    { id: 'hat_grad', name: 'Grad cap', icon: '👨‍🎓', price: 300 },
    { id: 'hat_crown', name: 'Crown', icon: '👑', price: 800 },
    { id: 'hat_ribbon', name: 'Ribbon', icon: '🎀', price: 400 },
    { id: 'hat_star', name: 'Star halo', icon: '⭐', price: 0, inviteOnly: true },
  ],
  outfits: [
    { id: 'outfit_default', name: 'Purple', icon: '👕', price: 0, owned: true },
    { id: 'outfit_red', name: 'Red', icon: '🔴', price: 200 },
    { id: 'outfit_blue', name: 'Blue', icon: '🔵', price: 200 },
    { id: 'outfit_green', name: 'Green', icon: '🟢', price: 200 },
  ],
  special: [
    { id: 'streak_shield', name: 'Streak Shield', icon: '🛡️', desc: 'Skip 1 day, keep streak', price: 500 },
    { id: 'extra_invite', name: 'Extra Invite', icon: '🎟️', desc: 'Invite 1 more friend', price: 1000 },
    { id: 'gift_card', name: 'Gift Card', icon: '🎁', desc: 'Redeem for real gift!', price: 3000 },
  ],
};

const TABS = ['hats', 'outfits', 'special'];

export default function ShopPage() {
  const navigate = useNavigate();
  const { user, userProfile, setUserProfile } = useStore();
  const [tab, setTab] = useState('hats');
  const [preview, setPreview] = useState(userProfile?.equipped || {});

  const equipped = userProfile?.equipped || {};
  const ownedItems = userProfile?.ownedItems || ['hat_default', 'outfit_default'];
  const points = userProfile?.points || 0;

  const handleBuy = async (item) => {
    if (ownedItems.includes(item.id)) {
      // Equip it
      const slotMap = { hat: 'hats', outfit: 'outfits' };
      const slot = item.id.startsWith('hat_') ? 'hat' : 'outfit';
      const newEquipped = { ...equipped, [slot]: item.id };
      try {
        await updateDoc(doc(db, 'users', user.uid), { equipped: newEquipped });
        setUserProfile({ ...userProfile, equipped: newEquipped });
        setPreview(newEquipped);
        toast.success('Equipped! ✨');
      } catch (e) { console.error(e); }
      return;
    }
    if (points < item.price) { toast.error('Not enough points!'); return; }
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        points: increment(-item.price),
        ownedItems: [...ownedItems, item.id],
      });
      setUserProfile({ ...userProfile, points: points - item.price, ownedItems: [...ownedItems, item.id] });
      toast.success(`Bought ${item.name}! ✨`);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconArrowLeft size={18} color="var(--text-secondary)" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-main)' }}>Shop</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--purple-50)', padding: '6px 12px', borderRadius: 20 }}>
          <IconStar size={14} color="var(--purple-600)" />
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--purple-600)' }}>{points.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Character preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, var(--purple-50), var(--purple-100))', borderRadius: 'var(--radius-xl)', padding: 20, marginBottom: 16, border: '1.5px solid var(--purple-200)', display: 'flex', justifyContent: 'center' }}>
          <MiniMe equipped={preview} size={110} />
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 16, gap: 4 }}>
          {TABS.map((t) => (
            <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '8px', borderRadius: 10, background: tab === t ? 'var(--bg-primary)' : 'transparent', color: tab === t ? 'var(--purple-600)' : 'var(--text-tertiary)', fontWeight: tab === t ? 800 : 500, fontSize: 13, boxShadow: tab === t ? 'var(--shadow-sm)' : 'none', textTransform: 'capitalize' }}>
              {t}
            </motion.button>
          ))}
        </div>

        {/* Items */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(ITEMS[tab] || []).map((item) => {
            const owned = ownedItems.includes(item.id) || item.price === 0;
            const isEquipped = Object.values(equipped).includes(item.id);
            return (
              <motion.div key={item.id} whileTap={{ scale: 0.96 }}
                onClick={() => handleBuy(item)}
                style={{
                  background: isEquipped ? 'var(--purple-50)' : 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)', padding: '14px 12px',
                  border: `1.5px solid ${isEquipped ? 'var(--purple-400)' : owned ? 'var(--purple-200)' : 'var(--border)'}`,
                  cursor: 'pointer', textAlign: 'center',
                  opacity: item.inviteOnly && !owned ? 0.5 : 1,
                }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 800, color: isEquipped ? 'var(--purple-800)' : 'var(--text-primary)', fontFamily: 'var(--font-main)', marginBottom: 4 }}>{item.name}</p>
                {item.desc && <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6, lineHeight: 1.4 }}>{item.desc}</p>}
                {isEquipped ? (
                  <span style={{ fontSize: 11, background: 'var(--purple-600)', color: 'white', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Equipped</span>
                ) : owned || item.price === 0 ? (
                  <span style={{ fontSize: 11, background: 'var(--green-50)', color: 'var(--green-600)', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Tap to equip</span>
                ) : item.inviteOnly ? (
                  <span style={{ fontSize: 11, background: 'var(--amber-50)', color: 'var(--amber-800)', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Invite reward</span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <IconStar size={12} color="var(--purple-600)" />
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--purple-600)' }}>{item.price}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
