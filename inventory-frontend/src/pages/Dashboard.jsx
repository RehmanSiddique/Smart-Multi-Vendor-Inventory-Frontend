import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { productAPI, saleAPI, handleApiError } from '../services/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    todayRevenue: 0,
    totalSales: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const seedSampleData = async () => {
    try {
      setSeeding(true);
      const response = await fetch('/api/v1/inventory/seed-sample-data/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sample data created:', data);
        setTimeout(() => fetchDashboardData(), 500);
      } else {
        console.error('❌ Failed to seed data');
      }
    } catch (err) {
      console.error('❌ Error seeding data:', err);
    } finally {
      setSeeding(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');
      
      const [productsRes, lowStockRes, salesRes] = await Promise.all([
        productAPI.getAll(),
        productAPI.getLowStock(),
        saleAPI.getToday(),
      ]);

      console.log('📦 Products response:', productsRes.data);
      console.log('⚠️ Low stock response:', lowStockRes.data);
      console.log('💰 Sales response:', salesRes.data);

      const products = productsRes.data.results || productsRes.data || [];
      const lowStock = lowStockRes.data.results || lowStockRes.data || [];
      const sales = salesRes.data.results || salesRes.data || [];

      console.log('📊 Processed data:');
      console.log('  - Products:', products.length);
      console.log('  - Low stock:', lowStock.length);
      console.log('  - Sales:', sales.length);

      const outOfStock = products.filter(p => (p.inventory?.quantity || 0) === 0).length;
      const todayRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);

      setStats({
        totalProducts: products.length,
        lowStock: lowStock.length,
        outOfStock,
        todayRevenue,
        totalSales: sales.length,
      });

      setLowStockProducts(lowStock.slice(0, 5));
      setRecentSales(sales.slice(0, 5));
      
      console.log('✅ Dashboard data loaded successfully');
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('❌ Error fetching dashboard data:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: '📦', value: stats.totalProducts, label: 'Total Products', color: '#4361ee' },
    { icon: '⚠️', value: stats.lowStock, label: 'Low Stock Items', color: '#f59e0b' },
    { icon: '❌', value: stats.outOfStock, label: 'Out of Stock', color: '#ef4444' },
    { icon: '💰', value: `$${stats.todayRevenue.toFixed(2)}`, label: 'Today Revenue', color: '#10b981' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your inventory.</p>
        </div>
        {stats.totalProducts === 0 && (
          <button 
            onClick={seedSampleData} 
            disabled={seeding}
            className="btn btn-primary"
            style={{ marginTop: '10px' }}
          >
            {seeding ? 'Creating Sample Data...' : 'Load Sample Data'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">⚠️ Low Stock Alert</h3>
            <Link to="/products" className="view-all-link">View All</Link>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Reorder</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td><span className="badge badge-warning">{product.inventory?.quantity || 0}</span></td>
                      <td>{product.inventory?.reorder_level || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No low stock items</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💰 Recent Sales</h3>
            <Link to="/sales" className="view-all-link">View All</Link>
          </div>
          {recentSales.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.sale_number}</td>
                      <td>{sale.customer_name || 'Walk-in'}</td>
                      <td>${parseFloat(sale.total).toFixed(2)}</td>
                      <td><span className="badge badge-success">{sale.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No sales today</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;