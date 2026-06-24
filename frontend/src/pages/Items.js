import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function Items() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || ''
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.status) params.status = filters.status;
        if (filters.category) params.category = filters.category;

        const res = await api.get('/items', { params });
        setItems(res.data);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="hub-page">
      <div className="hub-hero">
        <div className="container">
          <div className="hub-hero-grid">
            <div>
              <div className="hub-badge">Finder / Matchmaker Hub</div>
              <h1 className="hub-title">Browse lost & found</h1>
              <p className="hub-subtitle">Search items, filter by status and category, then view details.</p>
            </div>
            <div className="hub-hero-controls">
              <div className="hub-control">
                <div className="hub-label">Quick Actions</div>
                <button className="primary" onClick={() => navigate('/create-item')} style={{ width: '100%', marginTop: 10 }}>
                  ➕ Post Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container hub-body">
        {error && <div className="msg err">{error}</div>}

        <div className="hub-control" style={{ marginBottom: 18 }}>
          <div className="hub-label">Filters</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 10 }}>
            <div>
              <label>Search Keyword</label>
              <input
                type="text"
                placeholder="Search by keyword..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="Filter by category..."
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button
            className="ghost"
            onClick={() => setFilters({ keyword: '', status: '', category: '' })}
            style={{ padding: '10px 16px', fontSize: '13px', marginTop: 12 }}
          >
            ✕ Clear Filters
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>Loading items...</p>}

        {!loading && items.length === 0 && (
          <div className="hub-empty">
            <div className="hub-empty-icon">🔍</div>
            <div>
              <div className="hub-empty-title">No items found</div>
              <div className="hub-empty-subtitle">Try adjusting your filters or post a new item.</div>
            </div>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
            {items.map(item => (
              <div
                key={item._id}
                className="list-item"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => navigate(`/items/${item._id}`)}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
                  />
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                    <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--text)', fontSize: 16 }}>{item.title}</h4>
                    <span
                      style={{
                        backgroundColor: item.status === 'lost' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: item.status === 'lost' ? 'var(--danger)' : 'var(--ok)',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p style={{ margin: '8px 0', color: 'var(--muted)', fontSize: 14 }}>📍 {item.location}</p>
                  <p style={{ margin: '4px 0', color: 'var(--muted)', fontSize: 13 }}>🏷️ {item.category}</p>
                  <p style={{ margin: '8px 0', color: 'var(--text)', fontSize: 14, lineHeight: 1.4 }}>
                    {item.description.substring(0, 80)}...
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                    📅 {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="primary" onClick={(e) => { e.stopPropagation(); navigate(`/items/${item._id}`); }} style={{ flex: 1, padding: '10px 12px', fontSize: 14 }}>
                    View
                  </button>
                  {auth.user?.id === item.userId && (
                    <button className="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/edit-item/${item._id}`); }} style={{ flex: 1, padding: '10px 12px', fontSize: 14 }}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
