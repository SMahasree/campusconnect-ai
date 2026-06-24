import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function Leaderboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderRes, statsRes] = await Promise.all([
          api.get('/reputation/leaderboard?limit=20'),
          api.get('/reputation/me')
        ]);
        
        setLeaderboard(leaderRes.data.leaderboard);
        setUserStats(statsRes.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchData();
    }
  }, [auth.token]);

  if (loading) return <div className="container"><p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>Loading leaderboard...</p></div>;

  return (
    <>
      <nav className="top-nav">
        <div className="nav-container">
          <a href="#/" className="nav-brand">🏫 Campus L&F</a>
          <ul className="nav-links">
            <li><a href="#/dashboard">Dashboard</a></li>
            <li><a href="#/items">Browse Items</a></li>
            <li><a href="#/profile">Profile</a></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <div className="header">
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: '28px' }}>🏆 Top Contributors</h1>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Ranking our most helpful community members</p>
            </div>
          </div>

          <hr />

          {error && <div className="msg err">{error}</div>}

          {userStats && (
            <div style={{ 
              marginBottom: '24px', 
              padding: '20px', 
              backgroundColor: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(124, 58, 237, 0.2)'
            }}>
              <h3 style={{ color: 'var(--text)', margin: '0 0 16px 0', fontWeight: '600', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Reputation</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reputation Score</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>⭐ {userStats.reputation}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Points Earned</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{userStats.pointsEarned}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Returned</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--ok)' }}>✓ {userStats.itemsReturned}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Claims Verified</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--ok)' }}>✓ {userStats.claimsVerified}</p>
                </div>
              </div>
            </div>
          )}

          <h3 style={{ marginTop: 0, marginBottom: '16px', fontWeight: '600' }}>Leaderboard</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--muted)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rank</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--muted)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: 'var(--muted)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reputation</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: 'var(--muted)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Points</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: 'var(--muted)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Returned</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: 'var(--muted)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr 
                    key={user._id}
                    style={{ 
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: userStats?.email === user.email ? 'rgba(124, 58, 237, 0.05)' : 'var(--card)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '14px', fontWeight: '700', fontSize: '16px', color: 'var(--text)' }}>
                      {idx === 0 && '🥇 1st'}
                      {idx === 1 && '🥈 2nd'}
                      {idx === 2 && '🥉 3rd'}
                      {idx > 2 && `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text)', fontWeight: '500' }}>
                      {user.name}
                      {userStats?.email === user.email && <span style={{ color: 'var(--primary)', fontWeight: '600', marginLeft: '8px' }}>(You)</span>}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center', fontWeight: '600', color: 'var(--primary)' }}>
                      ⭐ {user.reputation}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center', color: 'var(--text)' }}>{user.pointsEarned}</td>
                    <td style={{ padding: '14px', textAlign: 'center', color: 'var(--ok)', fontWeight: '500' }}>✓ {user.itemsReturned}</td>
                    <td style={{ padding: '14px', textAlign: 'center', color: 'var(--ok)', fontWeight: '500' }}>✓ {user.claimsVerified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr />

          <div>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontWeight: '600' }}>How to Earn Points</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="list-item" style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '24px' }}>📱</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text)' }}>Post Item</p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>+5 points</p>
              </div>
              <div className="list-item" style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '24px' }}>✅</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text)' }}>Item Returned</p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>+50 points</p>
              </div>
              <div className="list-item" style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '24px' }}>🔍</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text)' }}>Verified Claim</p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>+20 points</p>
              </div>
              <div className="list-item" style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '24px' }}>🎯</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text)' }}>Claim Approved</p>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>+15 points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
