import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '' });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.updateProfile({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone
            });
            setUser(response.data);
            setEditing(false);
            // Optionally update localStorage if it's being used across the app
            localStorage.setItem('user_profile', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="empty-state" style={{ minHeight: '70vh' }}>
                    <div className="spinner"></div>
                    <p className="mt-4 text-text-muted text-sm font-medium">Loading profile...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>User <span className="text-primary">Profile</span></h1>
                        <p className="text-secondary">Manage your personal information and preferences.</p>
                    </div>
                </header>

                <div className="profile-premium-container">
                    
                    {/* Hero Banner Section */}
                    <div className="profile-hero animate-fade-in">
                        <div className="profile-hero-bg"></div>
                        <div className="profile-hero-content">
                            <div className="profile-hero-left">
                                <div className="profile-avatar-large shadow-lg">
                                    {user?.first_name?.[0] || 'U'}
                                </div>
                                <div className="profile-hero-info">
                                    <h2 className="profile-hero-name tracking-tight">{user?.first_name} {user?.last_name}</h2>
                                    <div className="profile-hero-role">
                                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                                        {user?.role || 'Administrator'}
                                    </div>
                                </div>
                            </div>
                            <button 
                                className={`btn-workbench ${editing ? 'btn-secondary-wb' : 'btn-primary-wb shadow-md'}`} 
                                onClick={() => setEditing(!editing)}
                            >
                                {editing ? 'Cancel Editing' : '✏️ Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {!editing ? (
                        /* View Mode */
                        <div className="profile-cards-grid animate-slide-up">
                            {/* Personal Info Card */}
                            <div className="profile-section-card hover:shadow-md transition-shadow">
                                <div className="profile-section-header">
                                    <div className="profile-section-icon shadow-sm">👤</div>
                                    <h3 className="profile-section-title tracking-tight">Personal Details</h3>
                                </div>
                                <div className="profile-data-list">
                                    <div className="profile-data-item">
                                        <span className="profile-data-label">First Name</span>
                                        <span className="profile-data-value text-lg">{user?.first_name || '—'}</span>
                                    </div>
                                    <div className="profile-data-item">
                                        <span className="profile-data-label">Last Name</span>
                                        <span className="profile-data-value text-lg">{user?.last_name || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info Card */}
                            <div className="profile-section-card hover:shadow-md transition-shadow" style={{ animationDelay: '0.1s' }}>
                                <div className="profile-section-header">
                                    <div className="profile-section-icon shadow-sm">✉️</div>
                                    <h3 className="profile-section-title tracking-tight">Contact Information</h3>
                                </div>
                                <div className="profile-data-list">
                                    <div className="profile-data-item">
                                        <span className="profile-data-label">Email Address</span>
                                        <span className="profile-data-value text-lg text-primary font-medium">{user?.email}</span>
                                    </div>
                                    <div className="profile-data-item">
                                        <span className="profile-data-label">Phone Number</span>
                                        <span className="profile-data-value text-lg">{user?.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Edit Mode Form */
                        <div className="profile-section-card animate-slide-up shadow-lg border-primary/20">
                            <div className="profile-section-header">
                                <div className="profile-section-icon bg-primary/10 text-primary">✏️</div>
                                <h3 className="profile-section-title tracking-tight">Edit Profile Information</h3>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="form-group-wb">
                                        <label className="label-wb">First Name</label>
                                        <input 
                                            type="text" 
                                            className="input-wb font-medium" 
                                            value={formData.first_name} 
                                            onChange={e => setFormData({...formData, first_name: e.target.value})} 
                                        />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Last Name</label>
                                        <input 
                                            type="text" 
                                            className="input-wb font-medium" 
                                            value={formData.last_name} 
                                            onChange={e => setFormData({...formData, last_name: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="input-wb opacity-60 cursor-not-allowed bg-surface-alt" 
                                            value={formData.email} 
                                            disabled 
                                        />
                                        <p className="text-xs text-text-muted mt-2">Email address cannot be changed.</p>
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            className="input-wb font-medium" 
                                            value={formData.phone} 
                                            onChange={e => setFormData({...formData, phone: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end pt-6 border-t border-border gap-4">
                                    <button type="button" className="btn-workbench btn-secondary-wb" onClick={() => setEditing(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-workbench btn-primary-wb shadow-md px-8">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;