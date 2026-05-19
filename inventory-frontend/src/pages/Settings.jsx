import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import './Products.css';

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: { email: true, push: false, lowStock: true, orderUpdates: true },
        display: { theme: 'light', language: 'en', currency: 'USD', dateFormat: 'MM/DD/YYYY' },
        business: { companyName: 'Enterprise Solutions Inc.', address: '777 Wealth St, Capital City', phone: '+1 800-555-0199', email: 'ops@company.com', taxId: 'TAX-9988-77' },
        inventory: { lowStockThreshold: 15, autoReorder: true, trackExpiry: true },
    });

    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
    }, []);

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
    };

    const handleSave = async () => {
        setSaving(true);
        localStorage.setItem('appSettings', JSON.stringify(settings));
        setTimeout(() => setSaving(false), 800);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: '⚙️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'business', label: 'Business Info', icon: '🏢' },
        { id: 'inventory', label: 'Inventory', icon: '📦' },
    ];

    const notificationLabels = {
        email: { title: 'Email Notifications', desc: 'Receive updates via email.' },
        push: { title: 'Push Notifications', desc: 'Browser push notifications.' },
        lowStock: { title: 'Low Stock Alerts', desc: 'Get notified when stock runs low.' },
        orderUpdates: { title: 'Order Updates', desc: 'Notifications for order status changes.' },
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <div
            className={`toggle-switch ${checked ? 'active' : 'inactive'}`}
            onClick={onChange}
            role="switch"
            aria-checked={checked}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(); } }}
        >
            <div className="toggle-knob"></div>
        </div>
    );

    return (
        <Layout>
            <div className="products-page">
                <div className="page-hud mb-8">
                    <div className="asset-title-block">
                        <h1>System <span className="text-primary">Settings</span></h1>
                        <p>Manage your application preferences</p>
                    </div>
                    <button className="btn-add-asset" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                    {/* Tab Sidebar */}
                    <div className="w-72 space-y-2" style={{ minWidth: '220px' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.875rem 1.25rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.8125rem',
                                    fontWeight: activeTab === tab.id ? 700 : 500,
                                    fontFamily: 'var(--font-sans)',
                                    transition: 'all 0.15s ease',
                                    background: activeTab === tab.id ? 'var(--primary)' : 'var(--surface)',
                                    color: activeTab === tab.id ? 'white' : 'var(--text-light)',
                                    boxShadow: activeTab === tab.id ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                                }}
                            >
                                <span style={{ fontSize: '1.125rem' }}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <div className="flex-1 glass-card p-8" style={{ minWidth: '300px' }}>
                        {activeTab === 'general' && (
                            <div>
                                <div className="mb-8 pb-4 border-b">
                                    <h3 className="text-xl font-bold">Display Preferences</h3>
                                    <p className="text-sm text-text-muted mt-1">Configure how the application looks and behaves.</p>
                                </div>

                                <div className="form-grid">
                                    <div>
                                        <label className="label-matrix">Theme</label>
                                        <select className="input-matrix" value={settings.display.theme} onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}>
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                            <option value="auto">System Default</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-matrix">Language</label>
                                        <select className="input-matrix" value={settings.display.language} onChange={(e) => handleSettingChange('display', 'language', e.target.value)}>
                                            <option value="en">English (US)</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div>
                                        <label className="label-matrix">Currency</label>
                                        <select className="input-matrix" value={settings.display.currency} onChange={(e) => handleSettingChange('display', 'currency', e.target.value)}>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-matrix">Date Format</label>
                                        <select className="input-matrix" value={settings.display.dateFormat} onChange={(e) => handleSettingChange('display', 'dateFormat', e.target.value)}>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div>
                                <div className="mb-8 pb-4 border-b">
                                    <h3 className="text-xl font-bold">Notification Preferences</h3>
                                    <p className="text-sm text-text-muted mt-1">Choose which notifications you want to receive.</p>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(settings.notifications).map(([key, val]) => (
                                        <div key={key} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem 1.25rem',
                                            background: 'var(--surface-alt)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border-light)',
                                            transition: 'all 0.15s ease',
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
                                                    {notificationLabels[key]?.title || key}
                                                </div>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {notificationLabels[key]?.desc || `Toggle ${key} notifications.`}
                                                </p>
                                            </div>
                                            <ToggleSwitch
                                                checked={val}
                                                onChange={() => handleSettingChange('notifications', key, !val)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'business' && (
                            <div>
                                <div className="mb-8 pb-4 border-b">
                                    <h3 className="text-xl font-bold">Business Information</h3>
                                    <p className="text-sm text-text-muted mt-1">Your registered business details.</p>
                                </div>

                                <div className="form-group-wb mb-6">
                                    <label className="label-matrix">Company Name</label>
                                    <input type="text" className="input-matrix" value={settings.business.companyName} onChange={(e) => handleSettingChange('business', 'companyName', e.target.value)} />
                                </div>
                                <div className="form-group-wb mb-6">
                                    <label className="label-matrix">Business Address</label>
                                    <textarea className="input-matrix" rows="2" value={settings.business.address} onChange={(e) => handleSettingChange('business', 'address', e.target.value)} />
                                </div>
                                <div className="form-grid">
                                    <div>
                                        <label className="label-matrix">Phone Number</label>
                                        <input type="tel" className="input-matrix" value={settings.business.phone} onChange={(e) => handleSettingChange('business', 'phone', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="label-matrix">Email Address</label>
                                        <input type="email" className="input-matrix" value={settings.business.email} onChange={(e) => handleSettingChange('business', 'email', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'inventory' && (
                            <div>
                                <div className="mb-8 pb-4 border-b">
                                    <h3 className="text-xl font-bold">Inventory Settings</h3>
                                    <p className="text-sm text-text-muted mt-1">Configure stock management behavior.</p>
                                </div>

                                <div className="form-group-wb mb-6">
                                    <label className="label-matrix">Low Stock Threshold</label>
                                    <input type="number" className="input-matrix" value={settings.inventory.lowStockThreshold} onChange={(e) => handleSettingChange('inventory', 'lowStockThreshold', parseInt(e.target.value))} />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Alert when stock falls below this number.</p>
                                </div>

                                <div className="space-y-4 mt-8">
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '1rem 1.25rem', background: 'var(--surface-alt)',
                                        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)',
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Auto Reorder</div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Automatically create purchase orders when stock is low.</p>
                                        </div>
                                        <ToggleSwitch
                                            checked={settings.inventory.autoReorder}
                                            onChange={() => handleSettingChange('inventory', 'autoReorder', !settings.inventory.autoReorder)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;