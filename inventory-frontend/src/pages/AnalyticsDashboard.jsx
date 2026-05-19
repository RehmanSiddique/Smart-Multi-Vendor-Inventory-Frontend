import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { analyticsAPI } from '../services/extendedApi';
import './Reports.css';

const AnalyticsDashboard = () => {
  const [days, setDays] = useState(30);

  const { data: metricsRes, isLoading } = useQuery({
    queryKey: ['analytics', days],
    queryFn: () => analyticsAPI.getDashboard(days),
    keepPreviousData: true,
  });

  const metrics = metricsRes?.data;

  const statCards = [
    { label: 'Total Revenue', value: `$${metrics?.total_revenue?.toLocaleString() || '0.00'}`, icon: '💰', color: 'var(--primary)', trend: '+12%' },
    { label: 'Order Volume', value: metrics?.total_orders || 0, icon: '🛒', color: 'var(--success)', trend: '+5%' },
    { label: 'Net Margin', value: `${metrics?.profit_margin?.toFixed(2) || '0.00'}%`, icon: '📈', color: '#8b5cf6', trend: '-2%' },
    { label: 'Avg Yield', value: `$${(metrics?.avg_order_value || 0).toFixed(0)}`, icon: '💵', color: 'var(--warning)', trend: '+8%' },
  ];

  return (
    <Layout>
      <div className="reports-page px-4">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Analytics Overview</span>
            </div>
            <h1 className="text-4xl font-black text-text tracking-tight mb-2">
              Analytics <span className="text-primary italic">Dashboard</span>
            </h1>
            <p className="text-text-muted font-medium text-sm">
              Key performance indicators and business metrics.
            </p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-border">
            {[7, 30, 90].map(r => (
              <button 
                key={r} 
                className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${days === r ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text hover:bg-surface-alt'}`}
                onClick={() => setDays(r)}
              >
                {r} Days
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <div key={i} className="workbench-card hover:shadow-xl transition-all duration-300 group border-none bg-white shadow-md">
              <div className="flex justify-between items-start mb-6">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">{stat.label}</div>
                <div className={`p-2 rounded-lg bg-surface-alt text-lg group-hover:scale-110 transition-transform`} style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <div className="text-3xl font-black text-text tracking-tighter">{stat.value}</div>
                <div className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>{stat.trend}</div>
              </div>
              <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 ease-out" 
                  style={{ 
                    width: '65%', 
                    backgroundColor: stat.color,
                    boxShadow: `0 0 12px ${stat.color}44`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="workbench-card bg-white border-none shadow-md overflow-hidden relative">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-warning-light flex items-center justify-center text-xl">⚠️</div>
                <div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Low Stock</div>
                  <div className="text-2xl font-black text-text">{metrics?.low_stock_count || 0} <span className="text-xs font-bold text-text-muted">Products</span></div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-warning"></div>
           </div>
           <div className="workbench-card bg-white border-none shadow-md overflow-hidden relative">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-danger-light flex items-center justify-center text-xl">🚨</div>
                <div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Out of Stock</div>
                  <div className="text-2xl font-black text-text">{metrics?.out_of_stock_count || 0} <span className="text-xs font-bold text-text-muted">Products</span></div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-danger"></div>
           </div>
           <div className="workbench-card bg-white border-none shadow-md overflow-hidden relative">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-success-light flex items-center justify-center text-xl">✨</div>
                <div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Top Performers</div>
                  <div className="text-2xl font-black text-text">{metrics?.top_products?.length || 0} <span className="text-xs font-bold text-text-muted">Products</span></div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1 h-full bg-success"></div>
           </div>
        </div>

        <div className="workbench-card bg-white border-none shadow-xl p-0 overflow-hidden">
          <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-surface-alt/20">
            <div>
              <h3 className="text-xl font-black text-text tracking-tight">Top Products Performance</h3>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1">Revenue contribution by product</p>
            </div>
            <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Export CSV</button>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="spinner-small mb-4"></div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Loading data...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-alt/50">
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">Rank</th>
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">Product Name</th>
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] text-center">Units Sold</th>
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] text-right">Revenue</th>
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] text-right">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.top_products?.map((p, idx) => {
                    const maxVal = metrics.top_products[0]?.revenue || 1;
                    const percent = Math.min((p.revenue / maxVal) * 100, 100);
                    return (
                      <tr key={idx} className="border-b border-border/50 hover:bg-surface-alt/30 transition-colors group">
                        <td className="px-8 py-6">
                          <span className="text-xs font-black text-text-muted">#0{idx + 1}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-text group-hover:text-primary transition-colors uppercase tracking-tight">{p.product__name}</div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-alt text-[10px] font-black text-text">
                            {p.total_sold} UNITS
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-sm font-black text-text">
                            ${parseFloat(p.revenue).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right w-64">
                          <div className="flex items-center gap-4 justify-end">
                            <div className="h-1.5 flex-1 bg-surface-alt rounded-full overflow-hidden max-w-[120px]">
                              <div 
                                className="h-full bg-primary transition-all duration-1000 ease-in-out" 
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-text-muted w-8">{Math.round(percent)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }) || (
                    <tr><td colSpan="5" className="text-center py-20 text-text-muted font-bold uppercase tracking-widest opacity-40 italic">No Activity Recorded</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;
