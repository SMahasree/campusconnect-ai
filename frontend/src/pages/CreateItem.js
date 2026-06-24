import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function CreateItem() {
  const { id: editId } = useParams();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'lost',
    date: new Date().toISOString().split('T')[0]
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('status', formData.status);
      data.append('date', formData.date);
      if (image) {
        data.append('image', image);
      }

      if (editId) {
        await api.put(`/items/${editId}`, data);
        alert('Item updated successfully!');
      } else {
        await api.post('/items', data);
        alert('Item created successfully!');
      }

      navigate('/items');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
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
              <h1 style={{ margin: '0 0 8px', fontSize: '28px' }}>{editId ? '✏️ Edit Item' : '📝 Post Lost or Found Item'}</h1>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Help the community find what they've lost</p>
            </div>
          </div>

          <hr />

          {error && <div className="msg err">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="col-6">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Black Samsung Phone"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Electronics, Books, Clothing"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Library, Cafeteria, Lab Building"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="lost">Lost Item</option>
                    <option value="found">Found Item</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Provide detailed information about the item (color, condition, special marks, etc.)"
                    style={{ minHeight: '120px', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            <hr />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="ghost" type="button" onClick={() => navigate('/items')} style={{ padding: '12px 20px' }}>
                Cancel
              </button>
              <button className="primary" type="submit" disabled={loading} style={{ padding: '12px 20px' }}>
                {loading ? 'Saving...' : editId ? 'Update Item' : 'Post Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
