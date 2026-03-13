import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { productAPI, saleAPI, handleApiError } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiAlertTriangle, 
  FiXCircle, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiShoppingCart
} from 'react-icons/fi';

// Import modern styles
import '../styles/modern-theme.css';
import '../styles/modern-components.css';
import '../styles/modern-dashboard.css';

const DashboardModern = () => {
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, lowStockRes, salesRes] = await Promise.all([
        productAPI.getAll(),
        productAPI.getLowStock(),
        saleAPI.getToday(),
      ]);

      const products = productsRes.data.results || productsRes.data || [];
      const lowStock = lowStockRes.data.results || lowStockRes.data || [];
      const sales = salesRes.data.results || salesRes.data || [];

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
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching dashboard data:', apiError);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="stat-card-enhanced">
      <div className="skeleton skeleton-avatar"></div>
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-container-modern">
          <div className="dashboard-header-modern">
            <div className="skeleton skeleton-title" style={{ width: '200px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '300px' }}></div>
          </div>
          <div className="stats-grid-modern">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { 
      icon: FiPackage, 
      value: stats.totalProducts, 
      label: 'Total Products', 
      color: '#6366f1',
      trend: '+12.5%',
      trendUp: true,
      link: '/products'
    },
    { 
      icon: FiAlertTriangle, 
      value: stats.lowStock, 
      label: 'Low Stock Items', 
      color: '#f59e0b',
      trend: '-5.2%',
      trendUp: false,
      link: '/products?filter=low-stock'
    },
    { 
      icon: FiXCircle, 
      value: stats.outOfStock, 
      label: 'Out of Stock', 
      color: '#ef4444',
      trend: '+2.1%',
      trendUp: true,
      link: '/products?filter=out-of-stock'
    },
    { 
      icon: FiDollarSign, 
      value: `$${stats.todayRevenue.toFixed(2)}`, 
      label: 'Today Revenue', 
      color: '#10b981',
      trend: '+18.3%',
      trendUp: true,
      link: '/sales'
    },
  ];

  return (
    <Layout>
      <div className="dashboard-container-modern">
        {/* Header */}
        <div className="dashboard-header-modern">
          <h1 className="dashboard-title-modern">Dashboard</h1>
          <p className="dashboard-subtitle-modern">
            Welcome back! Here's what's happening with your inventory.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-modern alert-error-modern">
            <FiAlertTriangle size={20} />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid-modern">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stat-card-enhanced">
                <div className="stat-header">
                  <div 
                    className="stat-icon-wrapper" 
                    style={{ 
                      backgroundColor: `${stat.color}15`,
                      color: stat.color 
                    }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                    {stat.trendUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                    {stat.trend}
                  </div>
                </div>
                
                <div className="stat-body">
                  <div className="stat-value-large">{stat.value}</div>
                  <div className="stat-label-text">{stat.label}</div>
                </div>
                
                <div className="stat-footer">
                  <span className="stat-comparison">vs last month</span>
                  <Link to={stat.link} className="stat-link">
                    View all <FiArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="dashboard-content-grid">
          {/* Low Stock Alert */}
          <div className="dashboard-card-half">
            <div className="card-with-header">
              <div className="card-header-modern">
                <h3 className="card-title-modern">
                  <FiAlertTriangle color="#f59e0b" />
                  Low Stock Alert
                </h3>
                <Link to="/products" className="btn-outline-modern btn-sm">
                  View All
                </Link>
              </div>
              <div className="card-body-modern">
                {lowStockProducts.length > 0 ? (
                  <div className="table-container">
                    <table className="table-modern">
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
                            <td style={{ fontWeight: 600 }}>{product.name}</td>
                            <td style={{ color: '#6b7280' }}>{product.sku}</td>
                            <td>
                              <span className="badge-modern badge-warning-modern">
                                {product.inventory?.quantity || 0}
                              </span>
                            </td>
                            <td>{product.inventory?.reorder_level || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FiPackage size={60} color="#d1d5db" />
                    </div>
                    <h3 className="empty-state-title">All stocked up!</h3>
                    <p className="empty-state-description">
                      No low stock items at the moment
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="dashboard-card-half">
            <div className="card-with-header">
              <div className="card-header-modern">
                <h3 className="card-title-modern">
                  <FiShoppingCart color="#10b981" />
                  Recent Sales
                </h3>
                <Link to="/sales" className="btn-outline-modern btn-sm">
                  View All
                </Link>
              </div>
              <div className="card-body-modern">
                {recentSales.length > 0 ? (
                  <div className="table-container">
                    <table className="table-modern">
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
                            <td style={{ fontWeight: 600 }}>{sale.sale_number}</td>
                            <td>{sale.customer_name || 'Walk-in'}</td>
                            <td style={{ fontWeight: 600, color: '#10b981' }}>
                              ${parseFloat(sale.total).toFixed(2)}
                            </td>
                            <td>
                              <span className="badge-modern badge-success-modern">
                                {sale.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FiShoppingCart size={60} color="#d1d5db" />
                    </div>
                    <h3 className="empty-state-title">No sales yet</h3>
                    <p className="empty-state-description">
                      Sales will appear here once you make your first transaction
                    </p>
                    <Link to="/sales/new" className="btn-primary-modern">
                      <FiShoppingCart /> Create Sale
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardModern;
