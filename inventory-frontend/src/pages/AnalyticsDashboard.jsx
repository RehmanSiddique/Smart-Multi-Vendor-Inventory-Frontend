import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { analyticsAPI } from '../services/extendedApi';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadMetrics();
  }, [days]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getDashboard(days);
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="loading">Loading analytics...</div></Layout>;

  return (
    <Layout>
      <div className="analytics-dashboard">
        <div className="page-header">
          <h1>📊 Analytics Dashboard</h1>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="period-select">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="metrics-grid">
          <div className="metric-card revenue">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Total Revenue</h3>
              <p className="metric-value">${metrics?.total_revenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="metric-card orders">
            <div className="metric-icon">🛒</div>
            <div className="metric-content">
              <h3>Total Orders</h3>
              <p className="metric-value">{metrics?.total_orders || 0}</p>
            </div>
          </div>

          <div className="metric-card profit">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3>Profit Margin</h3>
              <p className="metric-value">{metrics?.profit_margin?.toFixed(2) || '0.00'}%</p>
            </div>
          </div>

          <div className="metric-card avg-order">
            <div className="metric-icon">💵</div>
            <div className="metric-content">
              <h3>Avg Order Value</h3>
              <p className="metric-value">${metrics?.avg_order_value?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="metric-card low-stock">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <h3>Low Stock Items</h3>
              <p className="metric-value alert">{metrics?.low_stock_count || 0}</p>
            </div>
          </div>

          <div className="metric-card out-stock">
            <div className="metric-icon">❌</div>
            <div className="metric-content">
              <h3>Out of Stock</h3>
              <p className="metric-value alert">{metrics?.out_of_stock_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="top-products-section">
          <h2>🏆 Top Products</h2>
          <table className="top-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.top_products?.map((product, index) => (
                <tr key={index}>
                  <td>{product.product__name}</td>
                  <td>{product.total_sold}</td>
                  <td>${product.revenue?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;
