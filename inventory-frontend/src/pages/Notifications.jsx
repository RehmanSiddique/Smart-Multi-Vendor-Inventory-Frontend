import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { notificationAPI, handleApiError } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const ICON_MAP = {
  low_stock: '⚠️',
  sale_created: '🛒',
  sale_large: '💰',
  po_created: '📋',
  po_received: '📦',
  po_status: '🚚',
  product_created: '📦',
  inventory_adjusted: '📊',
  system: '⚙️',
  info: 'ℹ️',
  warning: '⚠️',
};

const PRIORITY_COLORS = {
  low: 'var(--text-muted)',
  medium: 'var(--primary)',
  high: '#f59e0b',
  critical: '#ef4444',
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter, typeFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'unread') params.is_read = false;
      if (filter === 'read') params.is_read = true;
      if (typeFilter !== 'all') params.notification_type = typeFilter;
      
      const response = await notificationAPI.getAll(params);
      const data = response.data.results || response.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear all read notifications?')) return;
    try {
      await notificationAPI.clearAll();
      setNotifications(prev => prev.filter(n => !n.is_read));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <Layout>
        <div className="empty-state" style={{ minHeight: '70vh' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading notifications...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="products-page">
        <header className="page-header-wb">
          <div className="header-title-area">
            <h1>🔔 <span className="text-primary">Notifications</span></h1>
            <p className="text-secondary">Stay updated with all system events and alerts.</p>
          </div>
          <div className="header-actions-area" style={{ display: 'flex', gap: '12px' }}>
            {unreadCount > 0 && (
              <button className="btn-workbench btn-primary-wb" onClick={handleMarkAllRead}>
                ✓ Mark All Read ({unreadCount})
              </button>
            )}
            <button className="btn-workbench btn-secondary-wb" onClick={handleClearAll}>
              🗑️ Clear Read
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="notification-filters">
          <div className="filter-tabs">
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="tab-badge">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          <select
            className="type-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="low_stock">Low Stock</option>
            <option value="sale_created">Sales</option>
            <option value="sale_large">Large Sales</option>
            <option value="po_created">PO Created</option>
            <option value="po_received">PO Received</option>
            <option value="po_status">PO Status</option>
            <option value="product_created">Products</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '40vh' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔕</div>
            <h3>No notifications</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {filter === 'unread' ? 'All caught up! No unread notifications.' : 'No notifications to display.'}
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${!notification.is_read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon-wrapper">
                  <span className="notification-icon">
                    {notification.icon || ICON_MAP[notification.notification_type] || '🔔'}
                  </span>
                </div>

                <div className="notification-body">
                  <div className="notification-header-row">
                    <h4 className="notification-title">{notification.title}</h4>
                    <div className="notification-meta">
                      <span
                        className="priority-badge"
                        style={{ color: PRIORITY_COLORS[notification.priority] || 'var(--text-muted)' }}
                      >
                        {notification.priority_display || notification.priority}
                      </span>
                      <span className="notification-time">{notification.time_ago}</span>
                    </div>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-footer-row">
                    <span className="notification-type-badge">
                      {notification.notification_type_display || notification.notification_type}
                    </span>
                    {notification.action_url && (
                      <span className="notification-action">View →</span>
                    )}
                  </div>
                </div>

                <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                  {!notification.is_read && (
                    <button
                      className="notif-action-btn"
                      onClick={() => handleMarkRead(notification.id)}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="notif-action-btn delete"
                    onClick={() => handleDelete(notification.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
