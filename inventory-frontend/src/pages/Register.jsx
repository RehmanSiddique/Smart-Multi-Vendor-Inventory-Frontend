import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, handleApiError } from '../services/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await authAPI.register(userData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
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
          <div className="presentation-badge">Join the Network</div>
          <h1 className="presentation-title">Scale with Confidence.</h1>
          <p className="presentation-subtitle">
            Create your enterprise account to unlock intelligent inventory management, global synchronization, and advanced analytics.
          </p>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} IMS Platform. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper" style={{ maxWidth: '480px' }}>

          <div className="mobile-brand">
            <div className="mobile-logo-icon">IM</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.025em' }}>IMS<span style={{ color: '#3b82f6' }}>PRO</span></span>
          </div>

          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Register your organization to begin managing inventory.</p>
          </div>

          {error && (
            <div className="alert-modern alert-danger">
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ animation: 'fadeSlideUp 0.7s ease-out forwards' }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@enterprise.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="form-input-wrapper">
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <input
                    type="password"
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength="8"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="form-input-wrapper">
                  <input
                    type="password"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '1.5rem' }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner-small" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div> Processing...
                </div>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already a member? <Link to="/login">Sign In Instead</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;