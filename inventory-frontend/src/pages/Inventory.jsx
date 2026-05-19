import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { productAPI } from '../services/api';
import './Products.css';

const Inventory = () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data: inventoryData, isLoading } = useQuery({
        queryKey: ['inventory', page],
        queryFn: () => productAPI.getAll({ page, limit }),
        keepPreviousData: true,
    });

    const products = inventoryData?.data?.results || [];
    const totalCount = inventoryData?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const getStatus = (p) => {
        const qty = p.inventory?.quantity || 0;
        const reorder = p.inventory?.reorder_level || 0;
        if (qty <= 0) return { text: 'Out of Stock', class: 'status-danger-wb' };
        if (qty <= reorder) return { text: 'Low Stock', class: 'status-warning-wb' };
        return { text: 'In Stock', class: 'status-success-wb' };
    };

    const lowStockCount = products.filter(p => (p.inventory?.quantity || 0) <= (p.inventory?.reorder_level || 0)).length;
    const totalValue = products.reduce((acc, p) => acc + (parseFloat(p.price) * (p.inventory?.quantity || 0)), 0);

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Stock <span className="text-primary">Levels</span></h1>
                        <p className="text-secondary">{totalCount} products tracked</p>
                    </div>
                    <button className="btn-workbench btn-secondary-wb" onClick={() => window.print()}>
                        🖨️ Print Report
                    </button>
                </header>

                <div className="kpi-summary-row">
                    <div className="kpi-mini-card">
                        <div className="kpi-mini-label">Total Products</div>
                        <div className="kpi-mini-value">{totalCount}</div>
                        <div className="kpi-mini-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: 'var(--primary)' }}>📦</div>
                    </div>
                    <div className="kpi-mini-card">
                        <div className="kpi-mini-label">Low Stock Alerts</div>
                        <div className="kpi-mini-value" style={{ color: 'var(--warning)' }}>{lowStockCount}</div>
                        <div className="kpi-mini-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', color: 'var(--warning)' }}>⚠️</div>
                    </div>
                    <div className="kpi-mini-card">
                        <div className="kpi-mini-label">Total Inventory Value</div>
                        <div className="kpi-mini-value">${totalValue.toLocaleString()}</div>
                        <div className="kpi-mini-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)' }}>💰</div>
                    </div>
                </div>

                <div className="data-table-container">
                    {isLoading ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p className="mt-4 text-text-muted text-sm">Loading stock levels...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📈</div>
                            <div className="empty-state-title">No inventory data</div>
                            <div className="empty-state-desc">Add products to start tracking stock levels.</div>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Warehouse</th>
                                        <th>Reorder Level</th>
                                        <th>Current Stock</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => {
                                        const status = getStatus(p);
                                        const qty = p.inventory?.quantity || 0;
                                        const reorder = p.inventory?.reorder_level || 1;
                                        const stockPercent = Math.min(100, (qty / (reorder * 2)) * 100);

                                        return (
                                            <tr key={p.id}>
                                                <td>
                                                    <div className="product-info-cell">
                                                        <span className="product-name-wb">{p.name}</span>
                                                        <span className="product-sku-wb">{p.sku}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-xs font-semibold text-secondary">{p.inventory?.location || 'Default'}</span>
                                                </td>
                                                <td><span className="text-sm font-bold text-text-muted">{p.inventory?.reorder_level || 0}</span></td>
                                                <td>
                                                    <div className="stock-indicator-wb">
                                                        <div className="stock-bar-wb">
                                                            <div
                                                                className="stock-fill-wb"
                                                                style={{
                                                                    width: `${stockPercent}%`,
                                                                    backgroundColor: status.class === 'status-success-wb' ? 'var(--success)' : (status.class === 'status-warning-wb' ? 'var(--warning)' : 'var(--danger)')
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="stock-value-wb">{qty}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${status.class}`}>
                                                        {status.text}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="pagination-wb">
                                <div className="pagination-info">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} products</div>
                                <div className="pagination-controls-wb">
                                    <button className="page-btn-wb" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)) return <button key={p} className={`page-btn-wb ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>;
                                        if (p === page - 3 || p === page + 3) return <span key={p} className="px-1 text-text-muted">…</span>;
                                        return null;
                                    })}
                                    <button className="page-btn-wb" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Inventory;