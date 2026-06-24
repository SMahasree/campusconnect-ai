import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function Matches() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemType, setItemType] = useState('lost');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await api.get('/matches', { params: { itemType } });
        setMatches(res.data.matches || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) fetchMatches();
  }, [auth.token, itemType]);

  const scoreBucket = (score) => {
    if (score >= 0.8) return { label: 'Strong', color: 'var(--ok)' };
    if (score >= 0.6) return { label: 'Good', color: 'var(--primary)' };
    return { label: 'Possible', color: 'var(--danger)' };
  };

  const renderItemChip = (status) =>
    status === 'lost' ? 'Lost' : 'Found';

  return (
    <div className="hub-page">
      <div className="hub-hero">
        <div className="container">
          <div className="hub-hero-grid">
            <div>
              <div className="hub-badge">Matchmaker Hub</div>
              <h1 className="hub-title">Find & Connect Lost/Found Items</h1>
              <p className="hub-subtitle">
                Intelligent matching using keyword similarity, location proximity, temporal proximity, and category alignment.
              </p>
            </div>

            <div className="hub-hero-controls">
              <div className="hub-control">
                <label className="hub-label">Show matches for</label>
                <select value={itemType} onChange={(e) => setItemType(e.target.value)} className="hub-select">
                  <option value="lost">Lost Items → Potential Found Matches</option>
                  <option value="found">Found Items → Potential Lost Matches</option>
                </select>
              </div>

              <div className="hub-algorithm-card">
                <div className="hub-algorithm-title">How scoring works</div>
                <ul className="hub-algorithm-list">
                  <li>Text Similarity (50%)</li>
                  <li>Location Proximity (25%)</li>
                  <li>Time Proximity (15%)</li>
                  <li>Category Match (10%)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container hub-body">
        {error && <div className="msg err">{error}</div>}

        {loading && (
          <div className="hub-empty">
            <div className="hub-spinner" aria-hidden />
            <div>
              <div className="hub-empty-title">Analyzing items…</div>
              <div className="hub-empty-subtitle">Running match scoring with AI-assisted similarity.</div>
            </div>
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="hub-empty">
            <div className="hub-empty-icon">🔎</div>
            <div>
              <div className="hub-empty-title">No matches found</div>
              <div className="hub-empty-subtitle">Post more items or switch the match direction.</div>
            </div>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="hub-matches">
            {matches.map((match, idx) => {
              const score = Number(match.similarity || 0);
              const bucket = scoreBucket(score);
              const scorePercentage = (score * 100).toFixed(1);

              const leftStatus = renderItemChip(match.lostOrFoundItem?.status);
              const rightStatus = renderItemChip(match.matchItem?.status);

              return (
                <div key={idx} className="match-card" style={{ '--match-accent': bucket.color }}>
                  <div className="match-top">
                    <div>
                      <div className="match-title">Match #{idx + 1}</div>
                      <div className="match-meta">
                        <span className="score-pill">
                          {bucket.label} • {scorePercentage}%
                        </span>
                        <span className="match-type">
                          {itemType === 'lost' ? 'Lost → Found' : 'Found → Lost'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="match-grid">
                    <div className="match-side">
                      <div className="match-side-header">
                        <span className="status-dot status-lost" />
                        <span>{leftStatus} Item</span>
                      </div>

                      <div className="match-field">
                        <div className="match-field-label">Title</div>
                        <div className="match-field-value">{match.lostOrFoundItem?.title}</div>
                      </div>
                      <div className="match-field">
                        <div className="match-field-label">Location</div>
                        <div className="match-field-value">{match.lostOrFoundItem?.location}</div>
                      </div>
                      <div className="match-field">
                        <div className="match-field-label">Description</div>
                        <div className="match-field-value match-desc">{match.lostOrFoundItem?.description}</div>
                      </div>

                      {match.lostOrFoundItem?.structuredData?.itemType && (
                        <div className="match-chip-row">
                          <span className="match-chip">{match.lostOrFoundItem.structuredData.itemType}</span>
                          {match.lostOrFoundItem.structuredData.color && (
                            <span className="match-chip">{match.lostOrFoundItem.structuredData.color}</span>
                          )}
                        </div>
                      )}

                      <button className="primary" onClick={() => navigate(`/items/${match.lostOrFoundItem?._id}`)}>
                        View Item
                      </button>
                    </div>

                    <div className="match-side">
                      <div className="match-side-header">
                        <span className="status-dot status-found" />
                        <span>{rightStatus} Item</span>
                      </div>

                      <div className="match-field">
                        <div className="match-field-label">Title</div>
                        <div className="match-field-value">{match.matchItem?.title}</div>
                      </div>
                      <div className="match-field">
                        <div className="match-field-label">Location</div>
                        <div className="match-field-value">{match.matchItem?.location}</div>
                      </div>
                      <div className="match-field">
                        <div className="match-field-label">Description</div>
                        <div className="match-field-value match-desc">{match.matchItem?.description}</div>
                      </div>

                      {match.matchItem?.structuredData?.itemType && (
                        <div className="match-chip-row">
                          <span className="match-chip">{match.matchItem.structuredData.itemType}</span>
                          {match.matchItem.structuredData.color && (
                            <span className="match-chip">{match.matchItem.structuredData.color}</span>
                          )}
                        </div>
                      )}

                      <button className="primary" onClick={() => navigate(`/items/${match.matchItem?._id}`)}>
                        View Item
                      </button>
                    </div>
                  </div>

                  <div className="why-panel">
                    <div className="why-title">Why this match?</div>
                    <div className="why-text">{match.reason || 'Keyword similarity and metadata alignment'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

