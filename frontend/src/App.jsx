// =========================
// Frontend: App.jsx (Login/Register + Main App)
// =========================
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import MapComponent from './components/MapComponent';
import RegionCard from './components/RegionCard';

const supabase = createClient(
  'https://iyoudtjevzodwchtatiq.supabase.co', // your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5b3VkdGpldnpvZHdjaHRhdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDUxMTMsImV4cCI6MjA3NTY4MTExM30.6pra6PbEV7IOajvQhL-LoOMOJ5Huey1i7GQDyX6LMQY' // your anon key
);

export default function App() {
  const [user, setUser] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);

  // Check session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        fetchUserAnalyses(data.session.user.id);
      }
    });
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    alert('Signup successful! Check your email to confirm your account.');
    setUser(data.user);
    fetchUserAnalyses(data.user.id);
  };

  const handleLogin = async () => {
    if (!email || !password) return alert('Please enter email and password.');
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    setUser(data.user);
    fetchUserAnalyses(data.user.id);
  };

  const fetchUserAnalyses = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/my-regions?user_id=${userId}`);
      const data = await res.json();
      if (data.regions) setAnalyses(data.regions);
    } catch (err) {
      console.error('Failed to fetch user analyses:', err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAnalyses([]);
    setSelectedRegion(null);
  };

  // ===== Render Login/Signup =====
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f4f8'
      }}>
        <div style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2E7D32' }}>
            {authMode === 'login' ? 'Login' : 'Register'} to TerraMind
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); authMode === 'login' ? handleLogin() : handleSignup(); }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                display: 'block',
                margin: '10px 0',
                padding: '10px',
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                display: 'block',
                margin: '10px 0',
                padding: '10px',
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#2E7D32',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '12px',
                width: '100%',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              style={{ color: '#2E7D32', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            >
              {authMode === 'login' ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ===== Main App UI =====
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🌱 TerraMind — AI-Powered Land Monitoring</h1>
        <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '6px', backgroundColor:'#D32F2F', color:'#fff', border:'none' }}>Logout</button>
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <MapComponent
            analyses={analyses}
            setAnalyses={setAnalyses}
            setSelectedRegion={setSelectedRegion}
            userId={user.id}
          />
        </div>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <RegionCard selectedRegion={selectedRegion} />
        </div>
      </div>
    </div>
  );
}
