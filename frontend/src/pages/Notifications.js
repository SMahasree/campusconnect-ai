import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function Notifications() {
  const auth = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchNotifications();
    }
  }, [auth.token]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) return <div className="container"><p>Loading notifications...</p></div>;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>🔔 Notifications</h2>
          <span className="badge">Alerts</span>
        </div>

        {error && <div className="msg err">{error}</div>}

        {notifications.length === 0 && <p>No notifications yet.</p>}

        <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
          {notifications.map(notification => (
            <div 
              key={notification._id}
              onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: notification.read ? '#f9f9f9' : '#e3f2fd',
                cursor: 'pointer',
                borderLeft: notification.read ? 'none' : '4px solid #2196F3'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>
                    {notification.type === 'potential_match' && '🎯'}
                    {notification.type === 'claim_update' && '📋'}
                    {notification.type === 'item_verified' && '✓'}
                    {' '}
                    {notification.title}
                  </h4>
                  <p style={{ margin: '0 0 8px 0' }}>{notification.message}</p>
                  
                  {notification.matchScore && (
                    <p style={{ margin: '0 0 8px 0', color: '#4CAF50', fontWeight: 'bold' }}>
                      Match Score: {(notification.matchScore * 100).toFixed(0)}%
                    </p>
                  )}
                  
                  {notification.reason && (
                    <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>
                      <em>{notification.reason}</em>
                    </p>
                  )}

                  <p style={{ 
                    margin: '10px 0 0 0', 
                    fontSize: '0.85em', 
                    color: '#999' 
                  }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {notification.actionUrl && (
                  <button 
                    className="primary"
                    onClick={() => window.location.href = notification.actionUrl}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
