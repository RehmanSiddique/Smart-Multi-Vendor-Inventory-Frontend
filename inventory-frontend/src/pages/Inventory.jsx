import React from 'react';
import Layout from '../components/Layout';

const Inventory = () => {
  return (
    <Layout>
      <div className="page-header">
        <h1>Inventory</h1>
        <p>Track and manage your stock levels</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">156</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">Low Stock</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">$45,678</div>
            <div className="stat-label">Inventory Value</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Inventory List</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MacBook Pro 14</td>
                <td>MBP-14-001</td>
                <td>25</td>
                <td>Aisle A, Shelf 1</td>
                <td><span className="badge badge-success">In Stock</span></td>
              </tr>
              <tr>
                <td>iPhone 15 Pro</td>
                <td>IPH-15-001</td>
                <td>3</td>
                <td>Aisle B, Shelf 2</td>
                <td><span className="badge badge-warning">Low Stock</span></td>
              </tr>
              <tr>
                <td>AirPods Pro</td>
                <td>AIR-001</td>
                <td>0</td>
                <td>Aisle C, Shelf 1</td>
                <td><span className="badge badge-danger">Out of Stock</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;