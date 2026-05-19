import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { analyticsAPI } from '../services/extendedApi';
import { dashboardAPI, handleApiError } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
    const { data: metricsRes, isLoading } = useQuery({
        queryKey: ['dashboard-metrics'],
        queryFn: () => analyticsAPI.getDashboard(30),
    });

    const metrics = metricsRes?.data;
    const [chartTimeframe, setChartTimeframe] = useState('30D');

    const queryClient = useQueryClient();
    const seedMutation = useMutation({
        mutationFn: () => dashboardAPI.seedSampleData(),
        onSuccess: (res) => {
            queryClient.invalidateQueries(); // Invalidate everything to refresh dashboard and other pages
            alert(res.data?.message || 'Sample data loaded successfully!');
        },
        onError: (err) => alert(`Action Failed: ${handleApiError(err).message}`)
    });

    const KpiCard = ({ title, value, subtitle, icon, color, trend }) => {
        const isPositive = trend > 0;
        return (
            <div className="premium-card kpi-wrapper">
                <div className="kpi-top-row">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
                        {icon}
                    </div>
                    {trend !== undefined && (
                        <div className="kpi-trend-pill" style={{
                            backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isPositive ? '#16a34a' : '#dc2626'
                        }}>
                            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <div className="kpi-title">{title}</div>
                <div className="kpi-value">{value}</div>
                {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
            </div>
        );
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#64748b',
                borderColor: 'rgba(226, 232, 240, 0.8)',
                borderWidth: 1,
                padding: 16,
                cornerRadius: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13, weight: '500' },
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(241, 245, 249, 0.5)', borderDash: [5, 5] },
                border: { display: false },
                ticks: { color: '#94a3b8', font: { size: 11, weight: '600' }, callback: (value) => '$' + value / 1000 + 'k' }
            },
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: '#94a3b8', font: { size: 11, weight: '600' } }
            }
        },
        interaction: { intersect: false, mode: 'index' },
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="empty-state" style={{ minHeight: '60vh' }}>
                    <div className="spinner"></div>
                    <p className="mt-4 text-text-muted text-sm font-medium">Loading dashboard...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="dashboard-grid">
                <div className="dashboard-main">
                    <header className="dashboard-header">
                        <h1>Dashboard <span className="text-primary">Overview</span></h1>
                        <p className="dashboard-subtitle">Real-time metrics and insights.</p>
                    </header>

                    <div className="kpi-row">
                        <KpiCard title="Total Revenue" value={`$${(metrics?.total_revenue || 0).toLocaleString()}`} icon="💰" trend={12.5} color="#2563eb" subtitle="vs last 30 days" />
                        <KpiCard title="Total Orders" value={metrics?.total_orders || 0} icon="📦" trend={8.2} color="#10b981" subtitle="vs last 30 days" />
                        <KpiCard title="Active Products" value={metrics?.total_products || 0} icon="📋" trend={-2.1} color="#8b5cf6" subtitle="SKUs in catalog" />
                    </div>

                    <div className="premium-card mt-2">
                        <div className="chart-header">
                            <h3 className="chart-title">Revenue Trend</h3>
                            <div className="chart-controls">
                                <button className={`chart-btn ${chartTimeframe === '7D' ? 'active' : ''}`} onClick={() => setChartTimeframe('7D')}>7D</button>
                                <button className={`chart-btn ${chartTimeframe === '30D' ? 'active' : ''}`} onClick={() => setChartTimeframe('30D')}>30D</button>
                                <button className={`chart-btn ${chartTimeframe === '90D' ? 'active' : ''}`} onClick={() => setChartTimeframe('90D')}>90D</button>
                            </div>
                        </div>
                        <div className="chart-container-wb">
                            <Line
                                data={{
                                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                                    datasets: [{
                                        label: 'Revenue',
                                        data: [15000, 22000, 18000, 31000, 28000],
                                        borderColor: '#2563eb',
                                        backgroundColor: (context) => {
                                            const chart = context.chart;
                                            const { ctx, chartArea } = chart;
                                            if (!chartArea) return null;
                                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
                                            gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
                                            return gradient;
                                        },
                                        fill: true,
                                        tension: 0.4,
                                        pointRadius: 0,
                                        pointHoverRadius: 8,
                                        pointBackgroundColor: '#2563eb',
                                        pointBorderColor: '#fff',
                                        pointBorderWidth: 3,
                                    }]
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>

                    <div className="premium-card">
                        <h3 className="widget-title mb-2">Quick Actions</h3>
                        <p className="text-sm text-text-muted mb-4">Frequently used operations.</p>
                        <div className="action-buttons-group">
                            <Link to="/sales" className="btn-premium btn-premium-primary">
                                <span className="text-xl">💳</span> Record Sale
                            </Link>
                            <Link to="/products" className="btn-premium btn-premium-secondary">
                                <span className="text-xl">➕</span> Add Product
                            </Link>
                            <Link to="/purchase-orders" className="btn-premium btn-premium-secondary">
                                <span className="text-xl">🚚</span> New Purchase Order
                            </Link>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to load sample products, suppliers, and sales? This will add fake data to your database.')) {
                                        seedMutation.mutate();
                                    }
                                }}
                                className="btn-premium btn-premium-secondary"
                                disabled={seedMutation.isPending}
                                style={{ textAlign: 'left', cursor: 'pointer', border: '1px dashed #cbd5e1' }}
                            >
                                <span className="text-xl">🌱</span> {seedMutation.isPending ? 'Loading...' : 'Load Sample Data'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dashboard-side">
                    <div className="premium-card system-status-card">
                        <div className="widget-header mb-4">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">System Status</span>
                            <span className="system-status-badge">
                                <span className="system-status-dot"></span> Online
                            </span>
                        </div>
                        <div className="status-metric">
                            <div className="status-metric-header">
                                <span className="text-sm font-semibold">Uptime</span>
                                <span className="text-sm font-bold text-success">99.8%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill progress-success" style={{ width: '99.8%' }}></div>
                            </div>
                        </div>
                        <div className="status-metric mt-4">
                            <div className="status-metric-header">
                                <span className="text-sm font-semibold">Load</span>
                                <span className="text-sm font-bold text-warning">42.1%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill progress-warning" style={{ width: '42.1%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="widget-header">
                            <span className="widget-title">Recent Activity</span>
                            <Link to="/reports" className="widget-link">View All</Link>
                        </div>
                        <div className="activity-list">
                            {[
                                { icon: '💳', text: 'Sale #SL-0045 completed', time: '2 mins ago', color: '#10b981' },
                                { icon: '⚠️', text: 'Low stock alert: SKU-X92', time: '18 mins ago', color: '#ef4444' },
                                { icon: '🚚', text: 'PO-124 shipped', time: '1 hour ago', color: '#2563eb' },
                                { icon: '✅', text: 'Supplier verified', time: '4 hours ago', color: '#8b5cf6' },
                                { icon: '💰', text: 'Payment received INV-22', time: 'Yesterday', color: '#10b981' }
                            ].map((item, i) => (
                                <div key={i} className="activity-item">
                                    <div className="activity-icon-premium" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                        {item.icon}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-text-premium">{item.text}</div>
                                        <div className="activity-time-premium">{item.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;