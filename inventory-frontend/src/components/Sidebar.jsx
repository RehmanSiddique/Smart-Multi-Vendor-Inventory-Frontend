import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>📦 Inventory</h2>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Main</h3>
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
            <span className="nav-icon">🏠</span>
            Dashboard
          </Link>
          <Link to="/analytics" className={`nav-item ${isActive('/analytics')}`}>
            <span className="nav-icon">📊</span>
            Analytics
          </Link>
        </div>

        <div className="nav-section">
          <h3>Inventory</h3>
          <Link to="/products" className={`nav-item ${isActive('/products')}`}>
            <span className="nav-icon">📦</span>
            Products
          </Link>
          <Link to="/categories" className={`nav-item ${isActive('/categories')}`}>
            <span className="nav-icon">📁</span>
            Categories
          </Link>
          <Link to="/inventory" className={`nav-item ${isActive('/inventory')}`}>
            <span className="nav-icon">📊</span>
            Stock Levels
          </Link>
          <Link to="/warehouses" className={`nav-item ${isActive('/warehouses')}`}>
            <span className="nav-icon">🏭</span>
            Warehouses
          </Link>
        </div>

        <div className="nav-section">
          <h3>Sales & Customers</h3>
          <Link to="/sales" className={`nav-item ${isActive('/sales')}`}>
            <span className="nav-icon">💰</span>
            Sales
          </Link>
          <Link to="/customers" className={`nav-item ${isActive('/customers')}`}>
            <span className="nav-icon">👥</span>
            Customers
          </Link>
          <Link to="/promotions" className={`nav-item ${isActive('/promotions')}`}>
            <span className="nav-icon">🎉</span>
            Promotions
          </Link>
        </div>

        <div className="nav-section">
          <h3>Purchasing</h3>
          <Link to="/suppliers" className={`nav-item ${isActive('/suppliers')}`}>
            <span className="nav-icon">🏢</span>
            Suppliers
          </Link>
          <Link to="/purchase-orders" className={`nav-item ${isActive('/purchase-orders')}`}>
            <span className="nav-icon">📋</span>
            Purchase Orders
          </Link>
        </div>

        <div className="nav-section">
          <h3>Tools</h3>
          <Link to="/bulk-operations" className={`nav-item ${isActive('/bulk-operations')}`}>
            <span className="nav-icon">⚡</span>
            Bulk Operations
          </Link>
          <Link to="/reports" className={`nav-item ${isActive('/reports')}`}>
            <span className="nav-icon">📈</span>
            Reports
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
