import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function ItemDetail() {
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      await api.post('/claims', {
        itemId: id,
        message: claimMessage
      });
      alert('Claim submitted successfully!');
      setClaimMessage('');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit claim');
    } finally {
      setClaiming(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/items/${id}`);
      alert('Item deleted successfully!');
      navigate('/items');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) return <div className="container"><p>Loading item...</p></div>;
  if (error) return <div className="container"><div className="msg err">{error}</div></div>;
  if (!item) return <div className="container"><p>Item not found</p></div>;

  const isOwner = auth.user?.id === item.userId;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>{item.title}</h2>
          <span className="badge">{item.status}</span>
        </div>

        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
          />
        )}

        <div style={{ marginBottom: '20px' }}>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Status:</strong> {item.returned ? '✓ Returned' : 'Pending'}</p>
          <p><strong>Posted:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
          {item.date && <p><strong>Item Date:</strong> {new Date(item.date).toLocaleDateString()}</p>}
          <p style={{ marginTop: '15px' }}><strong>Description:</strong></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{item.description}</p>
        </div>

        {!isOwner && item.status === 'found' && !item.returned && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Claim This Item</h3>
            <p>Is this your item? Submit a claim to the owner.</p>
            <textarea
              placeholder="Add a message for the owner (optional)..."
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              style={{ width: '100%', minHeight: '80px', marginBottom: '10px' }}
            />
            <button
              className="primary"
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        )}

        <div className="row">
          <button className="ghost" onClick={() => navigate('/items')}>
            Back to Items
          </button>
          {isOwner && (
            <>
              <button className="primary" onClick={() => navigate(`/edit-item/${item._id}`)}>
                Edit Item
              </button>
              <button className="ghost" onClick={handleDelete} style={{ color: 'red' }}>
                Delete Item
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
