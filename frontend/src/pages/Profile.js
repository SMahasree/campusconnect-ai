import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function Profile() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/reputation/me');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load reputation stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchStats();
    }
  }, [auth.token]);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  if (!auth.user) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="top-nav">
        <div className="nav-container">
          <a href="#/" className="nav-brand">🏫 Campus L&F</a>
          <ul className="nav-links">
            <li><a href="#/dashboard">Dashboard</a></li>
            <li><a href="#/items">Browse Items</a></li>
            <li><a href="#/leaderboard">Leaderboard</a></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <div className="header">
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: '28px' }}>👤 My Profile</h1>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Manage your account and reputation</p>
            </div>
          </div>

          <hr />

          <h3 style={{ marginTop: 0, marginBottom: '16px', fontWeight: '600' }}>Account Information</h3>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</p>
                <p style={{ margin: 0, color: 'var(--text)', fontSize: '16px', fontWeight: '600' }}>{auth.user.name}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</p>
                <p style={{ margin: 0, color: 'var(--text)', fontSize: '16px', fontWeight: '600' }}>{auth.user.email}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User ID</p>
                <p style={{ margin: 0, color: 'var(--text)', fontSize: '14px', fontWeight: '500', fontFamily: 'monospace' }}>{auth.user.id}</p>
              </div>
            </div>
          </div>

          {!loading && stats && (
            <>
              <h3 style={{ marginTop: 0, marginBottom: '16px', fontWeight: '600' }}>🏆 Reputation & Achievements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                <div className="stat-card">
                  <h3>Reputation Score</h3>
                  <p className="stat-number">⭐ {stats.reputation}</p>
                </div>
                <div className="stat-card">
                  <h3>Points Earned</h3>
                  <p className="stat-number">{stats.pointsEarned}</p>
                </div>
                <div className="stat-card">
                  <h3>Items Returned</h3>
                  <p className="stat-number">✓ {stats.itemsReturned}</p>
                </div>
                <div className="stat-card">
                  <h3>Claims Verified</h3>
                  <p className="stat-number">✓ {stats.claimsVerified}</p>
                </div>
              </div>

              <button 
                className="ghost"
                onClick={() => navigate('/leaderboard')}
                style={{ padding: '12px 20px', marginBottom: '24px' }}
              >
                🏅 View Leaderboard & Rankings
              </button>
            </>
          )}

          <hr />

          <h3 style={{ marginTop: 0, marginBottom: '16px', fontWeight: '600' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            <button className="primary" onClick={() => navigate('/create-item')} style={{ padding: '12px 16px', textAlign: 'center' }}>
              ➕ Post New Item
            </button>
            <button className="ghost" onClick={() => navigate('/items')} style={{ padding: '12px 16px', textAlign: 'center' }}>
              🔍 Browse Items
            </button>
            <button className="ghost" onClick={() => navigate('/claims')} style={{ padding: '12px 16px', textAlign: 'center' }}>
              📋 My Claims
            </button>
            <button className="ghost" onClick={() => navigate('/matches')} style={{ padding: '12px 16px', textAlign: 'center' }}>
              ⭐ Smart Matches
            </button>
          </div>

          <hr />

          <div style={{ padding: '16px', backgroundColor: 'rgba(124, 58, 237, 0.05)', borderRadius: '10px', border: '1px solid rgba(124, 58, 237, 0.2)', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text)', fontWeight: '600' }}>ℹ️ About Campus L&F</h4>
            <p style={{ margin: '8px 0 0', color: 'var(--muted)', lineHeight: '1.6' }}>
              Smart Campus Lost & Found System helps you report and find lost items on campus. Use the smart matching feature to discover potential matches between lost and found items. Earn reputation points by helping return items to their owners!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              className="ghost"
              onClick={handleLogout}
              style={{ padding: '12px 20px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
            >
              🚪 Logout
            </button>
            <button className="primary" onClick={() => navigate('/dashboard')} style={{ padding: '12px 20px' }}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
