import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/products', icon: '📦', label: 'Products' },
    { path: '/categories', icon: '📁', label: 'Categories' },
    { path: '/suppliers', icon: '🤝', label: 'Suppliers' },
    { path: '/purchase-orders', icon: '📋', label: 'Purchase Orders' },
    { path: '/sales', icon: '💰', label: 'Sales' },
    { path: '/inventory', icon: '📊', label: 'Inventory' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <span>IMS</span> Pro
        </div>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;