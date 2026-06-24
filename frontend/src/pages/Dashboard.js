import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, notifRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/notifications/unread-count').catch(() => ({ data: { unreadCount: 0 } }))
        ]);
        setStats(statsRes.data);
        setUnreadNotifications(notifRes.data.unreadCount);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchStats();
    }
  }, [auth.token]);

  if (loading) return <div className="container"><p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>Loading stats...</p></div>;

  return (
    <>
      <nav className="top-nav">
        <div className="nav-container">
          <a href="#/" className="nav-brand">🏫 Campus L&F</a>
          <ul className="nav-links">
            <li><a href="#/items">Browse Items</a></li>
            <li><a href="#/matches">Smart Matches</a></li>
            <li><a href="#/leaderboard">Leaderboard</a></li>
            <li><a href="#/profile">Profile</a></li>
            <li><button className="primary" onClick={() => auth.logout()} style={{ padding: '8px 16px', borderRadius: '8px' }}>Logout</button></li>
          </ul>
        </div>
      </nav>

      <div className="hub-page">
        <div className="hub-hero">
          <div className="container">
            <div className="hub-hero-grid">
              <div>
                <div className="hub-badge">Finder / Matchmaker Hub</div>
                <h1 className="hub-title">Welcome back, {auth.user?.name || 'User'}!</h1>
                <p className="hub-subtitle">Here’s your lost & found activity—items posted, claims, and smart actions.</p>
              </div>
              <div className="hub-hero-controls">
                {unreadNotifications > 0 && (
                  <div className="hub-control">
                    <div className="hub-label">Notifications</div>
                    <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--danger)' }}>
                      🔔 {unreadNotifications} New Notification{unreadNotifications !== 1 ? 's' : ''}
                    </div>
                    <button className="primary" onClick={() => navigate('/notifications')} style={{ width: '100%', marginTop: 12 }}>
                      View All
                    </button>
                  </div>
                )}

                <div className="hub-control">
                  <div className="hub-label">Quick Actions</div>
                  <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                    <button className="primary" onClick={() => navigate('/create-item')} style={{ width: '100%' }}>
                      ➕ Post New Item
                    </button>
                    <button className="ghost" onClick={() => navigate('/items')} style={{ width: '100%' }}>
                      🔍 Browse Items
                    </button>
                    <button className="ghost" onClick={() => navigate('/matches')} style={{ width: '100%' }}>
                      ⭐ Smart Matches
                    </button>
                    <button className="ghost" onClick={() => navigate('/claims')} style={{ width: '100%' }}>
                      📋 My Claims
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container hub-body">
          {error && <div className="msg err">{error}</div>}

          {stats && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Lost Items</h3>
                  <p className="stat-number">{stats.totals.totalLostItems}</p>
                </div>
                <div className="stat-card">
                  <h3>Found Items</h3>
                  <p className="stat-number">{stats.totals.totalFoundItems}</p>
                </div>
                <div className="stat-card">
                  <h3>Returned Items</h3>
                  <p className="stat-number">{stats.totals.totalReturnedItems}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Claims</h3>
                  <p className="stat-number">{stats.totals.totalClaims}</p>
                </div>
              </div>

              <div style={{ marginTop: 22 }}>
                <div className="hub-control">
                  <div className="hub-label">Your Activity</div>
                  <div className="stats-grid" style={{ marginTop: 14 }}>
                    <div className="list-item" style={{ textAlign: 'center' }}>
                      <h4 style={{ margin: 0, color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                        My Items Posted
                      </h4>
                      <p style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>{stats.user.userItems}</p>
                    </div>
                    <div className="list-item" style={{ textAlign: 'center' }}>
                      <h4 style={{ margin: 0, color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                        My Claims
                      </h4>
                      <p style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>{stats.user.userClaims}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
