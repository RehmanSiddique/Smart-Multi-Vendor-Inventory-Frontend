import React from 'react';
import Layout from '../components/Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Business intelligence and performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">$45,678</div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">27.3%</div>
            <div className="stat-label">Profit Margin</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">156</div>
            <div className="stat-label">Products Sold</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">Sales Overview</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-muted">Chart coming soon...</p>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Top Products</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MacBook Pro 14</td>
                  <td>12</td>
                  <td>$23,999.88</td>
                </tr>
                <tr>
                  <td>iPhone 15 Pro</td>
                  <td>25</td>
                  <td>$24,999.75</td>
                </tr>
                <tr>
                  <td>AirPods Pro</td>
                  <td>30</td>
                  <td>$7,499.70</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title">Inventory Valuation</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Items</th>
                <th>Value (Cost)</th>
                <th>Value (Retail)</th>
                <th>Potential Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Laptops</td>
                <td>25</td>
                <td>$36,250</td>
                <td>$49,999</td>
                <td>$13,749</td>
              </tr>
              <tr>
                <td>Phones</td>
                <td>50</td>
                <td>$37,500</td>
                <td>$49,999</td>
                <td>$12,499</td>
              </tr>
              <tr>
                <td>Accessories</td>
                <td>100</td>
                <td>$2,500</td>
                <td>$4,999</td>
                <td>$2,499</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;