import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, handleApiError } from '../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Pane - Presentation */}
      <div className="auth-presentation">
        <div className="presentation-logo">
          <div className="presentation-logo-icon">IM</div>
          <span>IMS<span style={{ color: '#60a5fa' }}>PRO</span></span>
        </div>

        <div className="presentation-content">
          <div className="presentation-badge">Enterprise Edition</div>
          <h1 className="presentation-title">Master Your Operations.</h1>
          <p className="presentation-subtitle">
            Experience the next generation of inventory and supply chain intelligence. Highly scalable, globally synchronized, and securely managed.
          </p>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} IMS Platform. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">

          <div className="mobile-brand">
            <div className="mobile-logo-icon">IM</div>
            <span className="text-xl font-black text-slate-800 tracking-tight">IMS<span className="text-primary">PRO</span></span>
          </div>

          <div className="auth-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your workspace.</p>
          </div>

          {error && (
            <div className="alert-modern alert-danger">
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="admin@enterprise.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <div className="form-input-wrapper">
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner-small" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div> Verifying...
                </div>
              ) : 'Continue to Dashboard'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an enterprise account? <Link to="/register">Contact Sales</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;