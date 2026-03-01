import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      lowStock: true,
      orderUpdates: true,
    },
    display: {
      theme: 'light',
      language: 'en',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
    },
    business: {
      companyName: '',
      address: '',
      phone: '',
      email: '',
      taxId: '',
    },
    inventory: {
      lowStockThreshold: 10,
      autoReorder: false,
      trackExpiry: true,
    },
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in real app, save to API)
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setTimeout(() => {
        setSaving(false);
        alert('Settings saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'business', label: 'Business Info', icon: '🏢' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
  ];

  return (
    <Layout>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your application preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>Display Settings</h3>
              
              <div className="form-group">
                <label className="form-label">Theme</label>
                <select
                  className="form-select"
                  value={settings.display.theme}
                  onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  className="form-select"
                  value={settings.display.language}
                  onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={settings.display.currency}
                  onChange={(e) => handleSettingChange('display', 'currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date Format</label>
                <select
                  className="form-select"
                  value={settings.display.dateFormat}
                  onChange={(e) => handleSettingChange('display', 'dateFormat', e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                  Email Notifications
                </label>
                <p className="form-help">Receive notifications via email</p>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  />
                  Push Notifications
                </label>
                <p className="form-help">Receive browser push notifications</p>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowStock}
                    onChange={(e) => handleSettingChange('notifications', 'lowStock', e.target.checked)}
                  />
                  Low Stock Alerts
                </label>
                <p className="form-help">Get notified when inventory is running low</p>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderUpdates}
                    onChange={(e) => handleSettingChange('notifications', 'orderUpdates', e.target.checked)}
                  />
                  Order Updates
                </label>
                <p className="form-help">Receive notifications for order status changes</p>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="settings-section">
              <h3>Business Information</h3>
              
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.business.companyName}
                  onChange={(e) => handleSettingChange('business', 'companyName', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={settings.business.address}
                  onChange={(e) => handleSettingChange('business', 'address', e.target.value)}
                  placeholder="Enter business address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={settings.business.phone}
                    onChange={(e) => handleSettingChange('business', 'phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settings.business.email}
                    onChange={(e) => handleSettingChange('business', 'email', e.target.value)}
                    placeholder="Enter business email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tax ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.business.taxId}
                  onChange={(e) => handleSettingChange('business', 'taxId', e.target.value)}
                  placeholder="Enter tax identification number"
                />
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="settings-section">
              <h3>Inventory Settings</h3>
              
              <div className="form-group">
                <label className="form-label">Low Stock Threshold</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.inventory.lowStockThreshold}
                  onChange={(e) => handleSettingChange('inventory', 'lowStockThreshold', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
                <p className="form-help">Alert when stock falls below this number</p>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.inventory.autoReorder}
                    onChange={(e) => handleSettingChange('inventory', 'autoReorder', e.target.checked)}
                  />
                  Auto Reorder
                </label>
                <p className="form-help">Automatically create purchase orders for low stock items</p>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.inventory.trackExpiry}
                    onChange={(e) => handleSettingChange('inventory', 'trackExpiry', e.target.checked)}
                  />
                  Track Expiry Dates
                </label>
                <p className="form-help">Monitor product expiration dates</p>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button className="btn btn-outline">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-container {
          display: flex;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .settings-sidebar {
          width: 250px;
          background: white;
          border-radius: 0.5rem;
          padding: 1rem;
          height: fit-content;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .settings-tab {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          text-align: left;
          border-radius: 0.375rem;
          cursor: pointer;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s ease;
        }

        .settings-tab:hover {
          background: #f3f4f6;
        }

        .settings-tab.active {
          background: #3b82f6;
          color: white;
        }

        .tab-icon {
          font-size: 1.25rem;
        }

        .settings-content {
          flex: 1;
          background: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .settings-section h3 {
          margin: 0 0 1.5rem 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .form-help {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .settings-actions {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .settings-container {
            flex-direction: column;
          }
          
          .settings-sidebar {
            width: 100%;
            display: flex;
            overflow-x: auto;
            padding: 1rem;
          }
          
          .settings-tab {
            white-space: nowrap;
            margin-right: 0.5rem;
            margin-bottom: 0;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Settings;