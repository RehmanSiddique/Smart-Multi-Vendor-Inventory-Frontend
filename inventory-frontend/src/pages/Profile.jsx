import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to update profile would go here
    setEditing(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {!editing ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #4361ee 0%, #8b5cf6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2.5rem',
                color: 'white'
              }}>
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <h2>{user?.first_name} {user?.last_name}</h2>
              <p style={{ color: '#64748b' }}>{user?.email}</p>
            </div>

            <div className="form-group">
              <label className="form-label">First Name</label>
              <p className="form-input" style={{ background: '#f1f5f9' }}>{user?.first_name || 'Not set'}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <p className="form-input" style={{ background: '#f1f5f9' }}>{user?.last_name || 'Not set'}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <p className="form-input" style={{ background: '#f1f5f9' }}>{user?.email}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <p className="form-input" style={{ background: '#f1f5f9' }}>{user?.phone || 'Not set'}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <p className="form-input" style={{ background: '#f1f5f9' }}>{user?.role || 'User'}</p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setEditing(true)}
              style={{ width: '100%' }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-input"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-input"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Profile;