import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, handleApiError } from '../services/api';
import './Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  // step 1: request code, step 2: verify and reset
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(response.data?.message || 'If an account exists with this email, a reset code has been sent.');
      setCode('');
      setStep(2);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(email, code, newPassword);
      setSuccess(response.data?.message || 'Password has been reset successfully.');

      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. Please login.' } });
      }, 2000);

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
          <div className="presentation-badge">Account Recovery</div>
          <h1 className="presentation-title">Regain Access.</h1>
          <p className="presentation-subtitle">
            Securely recover your account and resume managing your intelligent inventory and supply chain operations.
          </p>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} IMS Platform. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper" style={{ maxWidth: '440px' }}>

          <div className="mobile-brand">
            <div className="mobile-logo-icon">IM</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.025em' }}>IMS<span style={{ color: '#3b82f6' }}>PRO</span></span>
          </div>

          <div className="auth-header">
            <h2>Reset Password</h2>
            <p>{step === 1 ? "Enter your email to receive a secure reset code." : "Enter your reset code and choose a new password."}</p>
          </div>

          {error && (
            <div className="alert-modern alert-danger">
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert-modern" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '1.25rem' }}>✅</span>
              <div>{success}</div>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestCode} style={{ animation: 'fadeSlideUp 0.6s ease-out forwards' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@enterprise.com"
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '1.5rem' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner-small" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div> Sending Code...
                  </div>
                ) : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} style={{ animation: 'fadeSlideUp 0.6s ease-out forwards' }}>
              <div className="form-group">
                <label className="form-label">Reset Code</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="Enter the 6-digit code"
                    style={{ letterSpacing: '2px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="form-input-wrapper">
                  <input
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="8"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="form-input-wrapper">
                  <input
                    type="password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="8"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '1.5rem' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner-small" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div> Verifying...
                  </div>
                ) : 'Update Password'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  marginTop: '1rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}>
                Back to Email
              </button>
            </form>
          )}

          <div className="auth-footer" style={{ marginTop: '2rem' }}>
            Remembered your password? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
