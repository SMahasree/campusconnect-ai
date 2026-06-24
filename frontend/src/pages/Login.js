import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
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
      await auth.login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      await auth.googleLogin({ token: credentialResponse.credential });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="hub-page">
      <div className="hub-hero">
        <div className="container">
          <div className="hub-hero-grid" style={{ alignItems: 'center' }}>
            <div>
              <div className="hub-badge">Finder / Matchmaker Hub</div>
              <h1 className="hub-title">Welcome back</h1>
              <p className="hub-subtitle">
                Sign in to connect lost and found items, verify claims, and help campus community return what matters.
              </p>
            </div>

            <div className="hub-control" style={{ padding: 18 }}>
              <div className="hub-label">Sign in</div>

              {error && <div className="msg err" style={{ marginTop: 12 }}>{error}</div>}

              <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alice@example.com"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    required
                  />
                </div>

                <button className="primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 16 }}>
                  {loading ? 'Signing in...' : 'Continue'}
                </button>

                <div className="divider" style={{ margin: '18px 0 12px' }}>
                  or
                </div>

                <div style={{ marginBottom: 8 }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="Continue with Google"
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </div>

                <div style={{ textAlign: 'center', marginTop: 14, color: 'var(--muted)', fontWeight: 600, fontSize: 13 }}>
                  New here?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/register');
                    }}
                    style={{ color: 'var(--primary)' }}
                  >
                    Create an account
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


