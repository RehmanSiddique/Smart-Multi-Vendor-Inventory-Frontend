import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import './Reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [salesData, setSalesData] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [loading, setLoading] = useState(true);

  // Generate sample data based on time range
  const generateSampleData = (range) => {
    const now = new Date();
    let labels = [];
    let salesValues = [];
    let revenueValues = [];
    
    switch (range) {
      case 'daily':
        for (let i = 6; i >= 0; i--) {
          const date = subDays(now, i);
          labels.push(format(date, 'MMM dd'));
          salesValues.push(Math.floor(Math.random() * 50) + 20);
          revenueValues.push(Math.floor(Math.random() * 5000) + 2000);
        }
        break;
      case 'weekly':
        for (let i = 11; i >= 0; i--) {
          const weekStart = startOfWeek(subDays(now, i * 7));
          labels.push(format(weekStart, 'MMM dd'));
          salesValues.push(Math.floor(Math.random() * 300) + 100);
          revenueValues.push(Math.floor(Math.random() * 25000) + 10000);
        }
        break;
      case 'monthly':
        for (let i = 11; i >= 0; i--) {
          const monthStart = startOfMonth(subDays(now, i * 30));
          labels.push(format(monthStart, 'MMM yyyy'));
          salesValues.push(Math.floor(Math.random() * 1200) + 500);
          revenueValues.push(Math.floor(Math.random() * 100000) + 40000);
        }
        break;
      case 'yearly':
        for (let i = 4; i >= 0; i--) {
          const yearStart = startOfYear(subDays(now, i * 365));
          labels.push(format(yearStart, 'yyyy'));
          salesValues.push(Math.floor(Math.random() * 15000) + 5000);
          revenueValues.push(Math.floor(Math.random() * 1200000) + 500000);
        }
        break;
    }
    
    return { labels, salesValues, revenueValues };
  };

  useEffect(() => {
    setLoading(true);
    const { labels, salesValues, revenueValues } = generateSampleData(timeRange);
    
    setTimeout(() => {
      setSalesData({
        labels,
        datasets: [
          {
            label: 'Sales',
            data: salesValues,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      });
      
      setRevenueData({
        labels,
        datasets: [
          {
            label: 'Revenue ($)',
            data: revenueValues,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
          },
        ],
      });
      
      setInventoryData({
        labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
        datasets: [
          {
            data: [35, 25, 15, 15, 10],
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6',
            ],
            borderWidth: 0,
          },
        ],
      });
      
      setLoading(false);
    }, 500);
  }, [timeRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  return (
    <Layout>
      <div className="reports-container">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
          <div className="time-range-selector">
            <button 
              className={`time-btn ${timeRange === 'daily' ? 'active' : ''}`}
              onClick={() => setTimeRange('daily')}
            >
              Daily
            </button>
            <button 
              className={`time-btn ${timeRange === 'weekly' ? 'active' : ''}`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`time-btn ${timeRange === 'monthly' ? 'active' : ''}`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`time-btn ${timeRange === 'yearly' ? 'active' : ''}`}
              onClick={() => setTimeRange('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-content">
              <div className="stat-value">$45,678</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-change positive">+12.5%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon sales">📊</div>
            <div className="stat-content">
              <div className="stat-value">1,234</div>
              <div className="stat-label">Total Sales</div>
              <div className="stat-change positive">+8.3%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon products">📦</div>
            <div className="stat-content">
              <div className="stat-value">156</div>
              <div className="stat-label">Products Sold</div>
              <div className="stat-change negative">-2.1%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon profit">💎</div>
            <div className="stat-content">
              <div className="stat-value">27.3%</div>
              <div className="stat-label">Profit Margin</div>
              <div className="stat-change positive">+3.2%</div>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Sales Trend</h3>
              <div className="chart-period">{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View</div>
            </div>
            <div className="chart-container">
              {loading ? (
                <div className="chart-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading chart...</p>
                </div>
              ) : (
                <Line data={salesData} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Analysis</h3>
              <div className="chart-period">{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View</div>
            </div>
            <div className="chart-container">
              {loading ? (
                <div className="chart-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading chart...</p>
                </div>
              ) : (
                <Bar data={revenueData} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Category Distribution</h3>
              <div className="chart-period">Current Inventory</div>
            </div>
            <div className="chart-container">
              {loading ? (
                <div className="chart-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading chart...</p>
                </div>
              ) : (
                <Doughnut data={inventoryData} options={doughnutOptions} />
              )}
            </div>
          </div>

          <div className="chart-card performance-metrics">
            <div className="chart-header">
              <h3>Performance Metrics</h3>
            </div>
            <div className="metrics-list">
              <div className="metric-item">
                <div className="metric-label">Conversion Rate</div>
                <div className="metric-value">3.2%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: '32%'}}></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Customer Retention</div>
                <div className="metric-value">78%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: '78%'}}></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Inventory Turnover</div>
                <div className="metric-value">4.5x</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: '90%'}}></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Order Fulfillment</div>
                <div className="metric-value">96%</div>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: '96%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="data-tables">
          <div className="table-card">
            <h3>Top Performing Products</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>MacBook Pro 14</td>
                    <td>12</td>
                    <td>$23,999.88</td>
                    <td className="growth positive">+15%</td>
                  </tr>
                  <tr>
                    <td>iPhone 15 Pro</td>
                    <td>25</td>
                    <td>$24,999.75</td>
                    <td className="growth positive">+8%</td>
                  </tr>
                  <tr>
                    <td>AirPods Pro</td>
                    <td>30</td>
                    <td>$7,499.70</td>
                    <td className="growth negative">-3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card">
            <h3>Inventory Valuation</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Items</th>
                    <th>Cost Value</th>
                    <th>Retail Value</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Electronics</td>
                    <td>75</td>
                    <td>$73,750</td>
                    <td>$99,998</td>
                    <td className="margin high">35.6%</td>
                  </tr>
                  <tr>
                    <td>Clothing</td>
                    <td>150</td>
                    <td>$15,000</td>
                    <td>$24,999</td>
                    <td className="margin medium">66.7%</td>
                  </tr>
                  <tr>
                    <td>Books</td>
                    <td>200</td>
                    <td>$2,500</td>
                    <td>$4,999</td>
                    <td className="margin high">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;