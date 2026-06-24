import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.register({ name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    setError('Google signup coming soon');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-text">🏫 Campus L&F</div>
        </div>

        <div className="auth-content">
          <h2 className="auth-heading">Create your account</h2>
          <p className="auth-subtext">Join our community to report lost items and help others find theirs.</p>

          <button className="google-btn" onClick={handleGoogleSignup}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"></circle>
            </svg>
            Continue with Google
          </button>

          <div className="divider">or with email</div>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            {error && <div className="msg err">{error}</div>}

            <button className="primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '24px' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--muted)', fontSize: '14px' }}>
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: 'var(--primary)', fontWeight: '600' }}>
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

