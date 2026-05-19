import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { authAPI, productAPI, notificationAPI } from '../services/api';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [headerNotifications, setHeaderNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const headerRightRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const cachedProfile = localStorage.getItem('user_profile');
    if (cachedProfile) {
      try {
        setUserProfile(JSON.parse(cachedProfile));
      } catch(e) {}
    }

    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUserProfile(response.data);
        localStorage.setItem('user_profile', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchProfile();

    const handleClickOutside = (event) => {
      if (headerRightRef.current && !headerRightRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifResponse, countResponse] = await Promise.all([
          notificationAPI.getAll({ page_size: 5 }),
          notificationAPI.unreadCount()
        ]);
        const data = notifResponse.data.results || notifResponse.data || [];
        setHeaderNotifications(Array.isArray(data) ? data.slice(0, 5) : []);
        setUnreadCount(countResponse.data.unread_count || 0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setShowSearchResults(true);
    setIsSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await productAPI.getAll({ search: query });
        const results = response.data.results || response.data || [];
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-layout">
        <header className="top-header">
          <div className="header-left">
            <button
              className="sidebar-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>
            <div className="header-search" ref={searchContainerRef}>
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { if (searchQuery.trim().length > 0) setShowSearchResults(true); }}
              />
              {showSearchResults && (
                <div className="search-dropdown-menu">
                  {isSearching ? (
                    <div className="search-dropdown-item text-center text-text-muted py-4">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="search-results-list">
                      {searchResults.slice(0, 5).map(product => (
                        <div 
                          key={product.id} 
                          className="search-dropdown-item"
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchQuery('');
                            navigate('/products');
                          }}
                        >
                          <div className="search-item-icon">📦</div>
                          <div className="search-item-content">
                            <p className="search-item-title">{product.name}</p>
                            <span className="search-item-sku">{product.sku}</span>
                          </div>
                          <div className="search-item-price">${parseFloat(product.price).toFixed(2)}</div>
                        </div>
                      ))}
                      {searchResults.length > 5 && (
                        <div className="search-dropdown-footer" onClick={() => { setShowSearchResults(false); navigate('/products'); }}>
                          View all {searchResults.length} results
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="search-dropdown-item text-center text-text-muted py-4">No products found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="header-right" ref={headerRightRef}>
            {/* Notifications */}
            <div className="header-dropdown-container">
              <div 
                className={`icon-btn ${activeDropdown === 'notifications' ? 'active' : ''}`} 
                title="Notifications"
                onClick={() => toggleDropdown('notifications')}
              >
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </div>
              {activeDropdown === 'notifications' && (
                <div className="dropdown-menu notifications-menu">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button className="text-btn" onClick={async () => {
                        try {
                          await notificationAPI.markAllRead();
                          setHeaderNotifications(prev => prev.map(n => ({...n, is_read: true})));
                          setUnreadCount(0);
                        } catch(e) { console.error(e); }
                      }}>Mark all as read</button>
                    )}
                  </div>
                  <div className="dropdown-body">
                    {headerNotifications.length === 0 ? (
                      <div className="dropdown-item" style={{justifyContent: 'center', color: 'var(--text-muted)'}}>
                        <p className="item-text">No notifications yet</p>
                      </div>
                    ) : (
                      headerNotifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`dropdown-item ${!notif.is_read ? 'unread' : ''}`}
                          onClick={() => {
                            if (!notif.is_read) {
                              notificationAPI.markRead(notif.id);
                              setHeaderNotifications(prev => prev.map(n => n.id === notif.id ? {...n, is_read: true} : n));
                              setUnreadCount(prev => Math.max(0, prev - 1));
                            }
                            if (notif.action_url) {
                              setActiveDropdown(null);
                              navigate(notif.action_url);
                            }
                          }}
                          style={{cursor: 'pointer'}}
                        >
                          <div className={`item-icon ${notif.priority === 'high' || notif.priority === 'critical' ? 'alert' : notif.notification_type === 'sale_created' ? 'success' : 'info'}`}>
                            {notif.icon || '🔔'}
                          </div>
                          <div className="item-content">
                            <p className="item-text">{notif.title}</p>
                            <span className="item-time">{notif.time_ago}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="dropdown-footer">
                    <button className="full-width-btn" onClick={() => { setActiveDropdown(null); navigate('/notifications'); }}>View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="header-dropdown-container">
              <div 
                className={`icon-btn ${activeDropdown === 'help' ? 'active' : ''}`} 
                title="Help"
                onClick={() => toggleDropdown('help')}
              >
                ❓
              </div>
              {activeDropdown === 'help' && (
                <div className="dropdown-menu help-menu">
                  <div className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    <span className="item-icon">📚</span> Documentation
                  </div>
                  <div className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    <span className="item-icon">💬</span> Contact Support
                  </div>
                  <div className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    <span className="item-icon">⌨️</span> Keyboard Shortcuts
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                    <span className="item-icon">🔄</span> What's New
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="header-dropdown-container">
              <div 
                className={`profile-trigger ${activeDropdown === 'profile' ? 'active' : ''}`}
                onClick={() => toggleDropdown('profile')}
              >
                <div className="user-info-mini">
                  <div className="user-name-mini">{userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name}` : 'Admin User'}</div>
                  <div className="user-role-mini">{userProfile?.role || 'System Administrator'}</div>
                </div>
                <div className="avatar-sm">{userProfile?.first_name ? userProfile.first_name.charAt(0).toUpperCase() : 'A'}</div>
              </div>
              {activeDropdown === 'profile' && (
                <div className="dropdown-menu profile-menu">
                  <div className="dropdown-header profile-header">
                    <div className="avatar-md">{userProfile?.first_name ? userProfile.first_name.charAt(0).toUpperCase() : 'A'}</div>
                    <div className="profile-details">
                      <h4>{userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name}` : 'Admin User'}</h4>
                      <p>{userProfile?.email || 'admin@ims-pro.com'}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={() => { setActiveDropdown(null); navigate('/profile'); }}>
                    <span className="item-icon">👤</span> My Profile
                  </div>
                  <div className="dropdown-item" onClick={() => { setActiveDropdown(null); navigate('/settings'); }}>
                    <span className="item-icon">⚙️</span> Account Settings
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item text-danger" onClick={handleLogout}>
                    <span className="item-icon">🚪</span> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-container">
          <div key={location.pathname} className="page-transition-wrapper">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;