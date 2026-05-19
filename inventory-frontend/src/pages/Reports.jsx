import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { analyticsAPI } from '../services/extendedApi';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './Reports.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
);

const Reports = () => {
    const [timeRange, setTimeRange] = useState(30);

    const { data: metricsRes, isLoading: isMetricsLoading } = useQuery({
        queryKey: ['reports-dashboard', timeRange],
        queryFn: () => analyticsAPI.getDashboard(timeRange),
    });

    const { data: categoryRes, isLoading: isCatLoading } = useQuery({
        queryKey: ['reports-categories', timeRange],
        queryFn: () => analyticsAPI.getCategoryPerformance(timeRange),
    });

    const metrics = metricsRes?.data;
    const categories = categoryRes?.data || [];
    const topProducts = metrics?.top_products || [];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'bottom', 
                labels: { font: { size: 10, weight: '600' }, boxWidth: 8, padding: 20 } 
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#0f172a',
                bodyColor: '#64748b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, color: '#94a3b8' }
            },
            x: { 
                grid: { display: false }, 
                ticks: { font: { size: 10 }, color: '#94a3b8' } 
            },
        }
    };

    const RevenueCard = ({ label, value, trend, isUp, color }) => (
        <div className="metric-card-wb">
            <div className="metric-header-wb">
                <span className="metric-label-wb">{label}</span>
                <span className={`metric-trend-wb ${isUp ? 'trend-up' : 'trend-down'}`}>
                    {isUp ? '↑' : '↓'} {trend}%
                </span>
            </div>
            <div className="metric-value-wb">{value}</div>
            <div className="w-full h-1 bg-border-light rounded-full mt-4 overflow-hidden">
                <div className="h-full" style={{ width: '70%', backgroundColor: color }}></div>
            </div>
        </div>
    );

    if (isMetricsLoading || isCatLoading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="spinner"></div>
                    <p className="mt-4 text-text-muted text-sm font-medium">Loading reports...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="reports-page">
                <header className="analytics-header-wb">
                    <h1>Performance <span className="text-primary">Reports</span></h1>
                    <p className="text-secondary">View key performance metrics and trends.</p>
                    
                    <div className="range-selector-wb">
                        {[7, 30, 90].map(r => (
                            <button 
                                key={r} 
                                className={`btn-workbench text-[10px] px-6 py-2 ${timeRange === r ? 'btn-primary-wb shadow-sm' : 'btn-secondary-wb border-transparent'}`}
                                onClick={() => setTimeRange(r)}
                            >
                                {r} Days
                            </button>
                        ))}
                    </div>
                </header>

                <div className="analytics-metrics-grid">
                    <RevenueCard label="Gross Revenue" value={`$${(metrics?.total_revenue || 0).toLocaleString()}`} trend="12.4" isUp={true} color="var(--primary)" />
                    <RevenueCard label="Total Orders" value={metrics?.total_orders || 0} trend="8.1" isUp={true} color="var(--success)" />
                    <RevenueCard label="Profit Margin" value={`${(metrics?.profit_margin || 0).toFixed(1)}%`} trend="2.3" isUp={false} color="var(--secondary)" />
                    <RevenueCard label="Avg Order Value" value={`$${(metrics?.avg_order_value || 0).toFixed(0)}`} trend="4.7" isUp={true} color="var(--warning)" />
                </div>

                <div className="charts-layout-wb">
                    <div className="chart-card-wb">
                        <div className="chart-header-wb">
                            <h3 className="chart-title-wb">Revenue Trend</h3>
                            <p className="chart-subtitle-wb">Revenue over the selected time period.</p>
                        </div>
                        <div className="chart-canvas-container">
                            <Line 
                                data={{
                                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                                    datasets: [{
                                        label: 'Revenue',
                                        data: [4200, 5100, 4800, 6200, 7500],
                                        borderColor: '#2563eb',
                                        backgroundColor: 'rgba(37, 99, 235, 0.05)',
                                        fill: true,
                                        tension: 0.4
                                    }]
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>

                    <div className="chart-card-wb">
                        <div className="chart-header-wb">
                            <h3 className="chart-title-wb">Sales by Category</h3>
                            <p className="chart-subtitle-wb">Revenue breakdown by product category.</p>
                        </div>
                        <div className="chart-canvas-container" style={{ height: '280px' }}>
                            <Doughnut 
                                data={{
                                    labels: categories.map(c => c.product__category__name) || ['Electronics', 'Furniture', 'Tools'],
                                    datasets: [{
                                        data: categories.map(c => c.revenue) || [5000, 3000, 2000],
                                        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
                                        borderWidth: 4,
                                        borderColor: '#fff'
                                    }]
                                }}
                                options={{ ...chartOptions, cutout: '75%' }}
                            />
                        </div>
                        <div className="report-data-list">
                            {categories.slice(0, 3).map((c, i) => (
                                <div key={i} className="report-list-item">
                                    <span className="text-xs font-bold text-secondary uppercase">{c.product__category__name}</span>
                                    <span className="text-xs font-black text-text">${parseFloat(c.revenue).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="chart-card-wb mt-8">
                    <div className="chart-header-wb">
                        <h3 className="chart-title-wb">Top Selling Products</h3>
                        <p className="chart-subtitle-wb">Products generating the most revenue.</p>
                    </div>
                    <div className="chart-canvas-container" style={{ height: '300px' }}>
                        <Bar 
                            data={{
                                labels: topProducts.map(p => p.product__name) || ['Product A', 'Product B', 'Product C'],
                                datasets: [{
                                    label: 'Revenue',
                                    data: topProducts.map(p => p.revenue) || [2500, 1800, 1500],
                                    backgroundColor: '#2563eb',
                                    borderRadius: 8,
                                    barThickness: 32
                                }]
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;