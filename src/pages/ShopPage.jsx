import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useStore } from '../store';
import BottomNav from '../components/BottomNav';
import MiniMe from '../components/MiniMe';
import { IconArrowLeft, IconStar, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Item ID maps directly to what MiniMe reads
// equipped.hat = 'default' | 'grad' | 'crown' | 'ribbon' | 'none'
// equipped.bodyColor = 'default' | 'red' | 'blue' | 'green' | 'pink' | 'orange'

const ITEMS = {
  hats: [
    { id: 'default', slot: 'hat', name: 'Blue Cap', icon: '🎓', price: 0 },
    { id: 'grad',    slot: 'hat', name: 'Grad Cap', icon: '👨‍🎓', price: 300 },
    { id: 'crown',   slot: 'hat', name: 'Crown',    icon: '👑', price: 800 },
    { id: 'ribbon',  slot: 'hat', name: 'Ribbon',   icon: '🎀', price: 400 },
    { id: 'none',    slot: 'hat', name: 'No hat',   icon: '😊', price: 0 },
  ],
  outfits: [
    { id: 'default', slot: 'bodyColor', name: 'Purple', icon: '💜', price: 0 },
    { id: 'red',     slot: 'bodyColor', name: 'Red',    icon: '❤️', price: 200 },
    { id: 'blue',    slot: 'bodyColor', name: 'Blue',   icon: '💙', price: 200 },
    { id: 'green',   slot: 'bodyColor', name: 'Green',  icon: '💚', price: 200 },
    { id: 'pink',    slot: 'bodyColor', name: 'Pink',   icon: '🩷', price: 300 },
    { id: 'orange',  slot: 'bodyColor', name: 'Orange', icon: '🧡', price: 300 },
  ],
  special: [
    { id: 'streak_shield', slot: 'special', name: 'Streak Shield', icon: '🛡️', desc: 'Skip 1 day, keep streak', price: 500 },
    { id: 'extra_invite',  slot: 'special', name: 'Extra Invite',  icon: '🎟️', desc: 'Invite 1 more friend',   price: 1000 },
    { id: 'gift_card',     slot: 'special', name: 'Gift Card',     icon: '🎁', desc: 'Redeem for real gift!',  price: 3000 },
  ],
};

const TABS = [
  { id: 'hats', label: '🎩 Hats' },
  { id: 'outfits', label: '👕 Outfits' },
  { id: 'special', label: '⚡ Special' },
];

export default function ShopPage() {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile } = useStore();
  const [tab, setTab] = useState('hats');
  const [busy, setBusy] = useState(null);
  const [pendingEquipped, setPendingEquipped] = useState(null); // preview before save
  const [saving, setSaving] = useState(false);

  const equipped = userProfile?.equipped || {};
  const ownedItems = userProfile?.ownedItems || ['default'];
  const points = userProfile?.points || 0;

  // For preview, combine current equipped with slot-based preview
  const previewEquipped = pendingEquipped || equipped;

  const isOwned = (item) => {
    if (item.price === 0) return true;
    return ownedItems.includes(`${item.slot}:${item.id}`);
  };

  const isEquipped = (item) => (pendingEquipped || equipped)[item.slot] === item.id;

  const handleTap = async (item) => {
    if (item.slot === 'special') {
      if (points < item.price) { toast.error('Not enough points!'); return; }
      toast.success(`${item.name} applied! ✨`);
      return;
    }

    if (isOwned(item)) {
      // Preview it (save later with Save button)
      const current = pendingEquipped || equipped;
      if (current[item.slot] === item.id) return; // already selected
      setPendingEquipped({ ...current, [item.slot]: item.id });
      return;
    }

    // Buy it
    if (points < item.price) { toast.error('Not enough points!'); return; }
    setBusy(item.id);
    try {
      const key = `${item.slot}:${item.id}`;
      const newOwned = [...ownedItems, key];
      const newEquipped = { ...equipped, [item.slot]: item.id };
      await updateDoc(doc(db, 'users', user.uid), {
        points: points - item.price,
        ownedItems: newOwned,
        equipped: newEquipped,
      });
      updateProfile({ points: points - item.price, ownedItems: newOwned, equipped: newEquipped });
      toast.success(`Bought & equipped ${item.name}! 🎉`);
    } catch (e) {
      console.error(e);
      toast.error('Purchase failed');
    }
    setBusy(null);
  };

  const saveEquipped = async () => {
    if (!pendingEquipped) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { equipped: pendingEquipped });
      updateProfile({ equipped: pendingEquipped });
      setPendingEquipped(null);
      toast.success('Saved! ✨');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  const discardChanges = () => setPendingEquipped(null);

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconArrowLeft size={18} color="var(--text-secondary)" />
        </motion.button>
        <h1 style={{ flex: 1, fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-main)' }}>Shop</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--purple-50)', padding: '7px 14px', borderRadius: 20, border: '1px solid var(--purple-200)' }}>
          <IconStar size={14} color="var(--purple-600)" />
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple-600)', fontFamily: 'var(--font-main)' }}>{points.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Character preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, var(--purple-50), var(--purple-100))',
            borderRadius: 'var(--radius-xl)', padding: '20px',
            marginBottom: 16, border: '1.5px solid var(--purple-200)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
          <MiniMe equipped={previewEquipped} size={110} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, background: 'white', color: 'var(--purple-600)', padding: '3px 10px', borderRadius: 20, fontWeight: 700, border: '1px solid var(--purple-200)' }}>
              Hat: {ITEMS.hats.find(h => h.id === ((pendingEquipped || equipped).hat || 'default'))?.name || 'Default'}
            </span>
            <span style={{ fontSize: 11, background: 'white', color: 'var(--purple-600)', padding: '3px 10px', borderRadius: 20, fontWeight: 700, border: '1px solid var(--purple-200)' }}>
              Color: {ITEMS.outfits.find(o => o.id === ((pendingEquipped || equipped).bodyColor || 'default'))?.name || 'Purple'}
            </span>
          </div>
          {pendingEquipped && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <motion.button whileTap={{ scale: 0.95 }} onClick={saveEquipped} disabled={saving}
                style={{ flex: 1, padding: '10px', background: 'var(--purple-600)', color: 'white', borderRadius: 12, fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>
                {saving ? 'Saving...' : '✓ Save outfit'}
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={discardChanges}
                style={{ padding: '10px 16px', background: 'white', color: 'var(--text-secondary)', borderRadius: 12, fontWeight: 700, fontSize: 13, border: '1px solid var(--border)', cursor: 'pointer' }}>
                Discard
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 16, gap: 4 }}>
          {TABS.map((t) => (
            <motion.button key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '9px 4px', borderRadius: 10,
                background: tab === t.id ? 'var(--bg-primary)' : 'transparent',
                color: tab === t.id ? 'var(--purple-600)' : 'var(--text-tertiary)',
                fontWeight: tab === t.id ? 800 : 500, fontSize: 12,
                boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
              }}>
              {t.label}
            </motion.button>
          ))}
        </div>

        {/* Items grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <AnimatePresence mode="wait">
            {(ITEMS[tab] || []).map((item, i) => {
              const owned = isOwned(item);
              const equipped_ = isEquipped(item);
              const loading = busy === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !loading && handleTap(item)}
                  style={{
                    background: equipped_ ? 'var(--purple-50)' : 'var(--bg-primary)',
                    borderRadius: 'var(--radius-lg)', padding: '16px 12px',
                    border: `1.5px solid ${equipped_ ? 'var(--purple-400)' : owned ? 'var(--purple-200)' : 'var(--border)'}`,
                    cursor: loading ? 'wait' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}>
                  {equipped_ && (
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconCheck size={12} color="white" />
                    </div>
                  )}
                  <div style={{ fontSize: 34, marginBottom: 8 }}>{item.icon}</div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: equipped_ ? 'var(--purple-800)' : 'var(--text-primary)', fontFamily: 'var(--font-main)', marginBottom: 6 }}>{item.name}</p>
                  {item.desc && <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, lineHeight: 1.4 }}>{item.desc}</p>}

                  {loading ? (
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>...</div>
                  ) : equipped_ ? (
                    <span style={{ fontSize: 11, background: 'var(--purple-600)', color: 'white', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Equipped ✓</span>
                  ) : owned ? (
                    <span style={{ fontSize: 11, background: 'var(--green-50)', color: 'var(--green-600)', padding: '3px 10px', borderRadius: 20, fontWeight: 700, border: '1px solid var(--green-400)' }}>Tap to equip</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <IconStar size={12} color="var(--purple-600)" />
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--purple-600)', fontFamily: 'var(--font-main)' }}>{item.price}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
