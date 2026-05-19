import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { section: 'MAIN', items: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/analytics', label: 'Analytics', icon: '📊' },
  ]},
  { section: 'INVENTORY', items: [
      { path: '/products', label: 'Products', icon: '📦' },
      { path: '/inventory', label: 'Stock Levels', icon: '📈' },
      { path: '/categories', label: 'Categories', icon: '📁' },
      { path: '/warehouses', label: 'Warehouses', icon: '🏢' },
  ]},
  { section: 'OPERATIONS', items: [
      { path: '/purchase-orders', label: 'Purchase Orders', icon: '📋' },
      { path: '/sales', label: 'Sales', icon: '💰' },
  ]},
  { section: 'PEOPLE', items: [
      { path: '/suppliers', label: 'Suppliers', icon: '🤝' },
      { path: '/customers', label: 'Customers', icon: '👥' },
  ]},
  { section: 'SYSTEM', items: [
      { path: '/reports', label: 'Reports', icon: '📜' },
      { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]}
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-icon">📦</span>
          <span className="logo-text">IMS Pro</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section, idx) => (
          <div key={idx} className="nav-section">
            <span className="nav-section-title">{section.section}</span>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          <span>🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
