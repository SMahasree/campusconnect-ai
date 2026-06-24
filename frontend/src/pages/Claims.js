import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function Claims() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get('/claims');
        setClaims(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load claims');
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchClaims();
    }
  }, [auth.token]);

  const handleUpdateClaim = async (claimId, newStatus) => {
    try {
      await api.put(`/claims/${claimId}`, { status: newStatus });
      alert(`Claim ${newStatus}!`);
      setClaims(claims.map(c => c._id === claimId ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update claim');
    }
  };

  if (loading) return <div className="container"><p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>Loading claims...</p></div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'var(--ok)';
      case 'rejected': return 'var(--danger)';
      default: return '#f59e0b';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'approved': return 'rgba(16, 185, 129, 0.1)';
      case 'rejected': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(245, 158, 11, 0.1)';
    }
  };

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
              <h1 style={{ margin: '0 0 8px', fontSize: '28px' }}>📋 My Claims</h1>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Track your item claims and responses</p>
            </div>
            <button className="primary" onClick={() => navigate('/items')} style={{ padding: '12px 20px' }}>
              🔍 Browse Items
            </button>
          </div>

          <hr />

          {error && <div className="msg err">{error}</div>}

          {claims.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fafafa', borderRadius: '10px' }}>
              <p style={{ fontSize: '48px', margin: '0 0 16px' }}>📋</p>
              <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px' }}>No claims yet</p>
              <p style={{ color: 'var(--muted)', margin: 0 }}>Browse lost and found items to make claims</p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
            {claims.map(claim => (
              <div key={claim._id} className="list-item" style={{ transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '18px', color: 'var(--text)' }}>
                      {claim.itemId?.title}
                    </h4>
                    <span style={{
                      backgroundColor: getStatusBg(claim.status),
                      color: getStatusColor(claim.status),
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      display: 'inline-block'
                    }}>
                      {claim.status}
                    </span>
                  </div>
                  <span style={{
                    backgroundColor: claim.itemId?.status === 'lost' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: claim.itemId?.status === 'lost' ? 'var(--danger)' : 'var(--ok)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {claim.itemId?.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px', fontSize: '14px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</p>
                    <p style={{ margin: 0, color: 'var(--text)' }}>🏷️ {claim.itemId?.category}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</p>
                    <p style={{ margin: 0, color: 'var(--text)' }}>📍 {claim.itemId?.location}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Claimed On</p>
                    <p style={{ margin: 0, color: 'var(--text)' }}>📅 {new Date(claim.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {claim.message && (
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px', marginBottom: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '12px', fontWeight: '600' }}>Your Message</p>
                    <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.5' }}>{claim.message}</p>
                  </div>
                )}

                {/* If you're the item owner, show approve/reject options */}
                {auth.user?.id === claim.itemId?.userId && claim.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                    <button
                      className="primary"
                      onClick={() => handleUpdateClaim(claim._id, 'approved')}
                      style={{ flex: 1, backgroundColor: 'var(--ok)', padding: '12px 16px' }}
                    >
                      ✓ Approve Claim
                    </button>
                    <button
                      className="ghost"
                      onClick={() => handleUpdateClaim(claim._id, 'rejected')}
                      style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)', padding: '12px 16px' }}
                    >
                      ✕ Reject Claim
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
