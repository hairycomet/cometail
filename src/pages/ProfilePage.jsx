import BottomNav from '../components/BottomNav';
export default function ProfilePage() {
  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ padding: '52px 20px 20px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 20, fontWeight: 900, color: 'var(--purple-800)' }}>ProfilePage</h1>
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ color: 'var(--text-secondary)' }}>Coming soon...</p>
      </div>
      <BottomNav />
    </div>
  );
}
