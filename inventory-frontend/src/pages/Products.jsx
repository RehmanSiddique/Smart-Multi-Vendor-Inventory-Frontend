import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { productAPI, handleApiError } from '../services/api';
import ProductForm from './ProductForm';
import './Products.css';

const Products = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    const { data: productRes, isLoading } = useQuery({
        queryKey: ['products', page, limit, searchTerm],
        queryFn: () => productAPI.getAll({ page, limit, search: searchTerm }),
        keepPreviousData: true,
    });

    const products = productRes?.data?.results || productRes?.data || [];
    const totalCount = productRes?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const deleteMutation = useMutation({
        mutationFn: (id) => productAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (err) => alert(`Delete failed: ${handleApiError(err).message}`)
    });

    const handleEdit = (p) => {
        setEditingProduct(p);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Product <span className="text-primary">Inventory</span></h1>
                        <p className="text-secondary">{totalCount} items in total stock</p>
                    </div>
                    <button className="btn-workbench btn-primary-wb" onClick={handleAddNew}>
                        ➕ Add New Product
                    </button>
                </header>

                <div className="filter-bar-wb">
                    <div className="search-input-wb">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by SKU or product name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="filter-actions">
                        <select
                            className="btn-workbench btn-secondary-wb text-xs"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                        {searchTerm && (
                            <button className="btn-workbench btn-secondary-wb text-xs text-danger" onClick={() => setSearchTerm('')}>
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Modal Overlay for Product Form */}
                {showForm && (
                    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                        <div className="modal-content modal-content-lg">
                            <ProductForm
                                initialData={editingProduct}
                                onComplete={() => setShowForm(false)}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                )}

                <div className="data-table-container">
                    {isLoading ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p className="mt-4 text-text-muted text-sm">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <div className="empty-state-title">No products found</div>
                            <div className="empty-state-desc">
                                {searchTerm ? 'Try a different search term.' : 'Click "Add New Product" to get started.'}
                            </div>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Product Details</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th className="text-right px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="product-info-cell">
                                                    <span className="product-name-wb">{p.name}</span>
                                                    <span className="product-sku-wb">{p.sku}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-xs font-semibold text-secondary">{p.category_name || 'General'}</span>
                                            </td>
                                            <td>
                                                <div className="text-sm font-bold">${p.price}</div>
                                                <div className="text-xs text-text-muted">Cost: ${p.cost}</div>
                                            </td>
                                            <td>
                                                <div className="stock-indicator-wb">
                                                    <div className="stock-bar-wb">
                                                        <div
                                                            className="stock-fill-wb"
                                                            style={{
                                                                width: `${Math.min((p.inventory?.quantity || 0), 100)}%`,
                                                                backgroundColor: (p.inventory?.quantity || 0) < 10 ? 'var(--danger)' : 'var(--primary)'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="stock-value-wb">{p.inventory?.quantity || 0}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${p.is_active ? 'status-success-wb' : 'status-danger-wb'}`}>
                                                    {p.is_active ? 'Active' : 'Archived'}
                                                </span>
                                            </td>
                                            <td className="px-4">
                                                <div className="action-row-wb">
                                                    <button className="icon-action-btn" title="Edit" onClick={() => handleEdit(p)}>
                                                        ✏️
                                                    </button>
                                                    <button className="icon-action-btn delete" title="Delete" onClick={() => { if(window.confirm('Delete this product?')) deleteMutation.mutate(p.id); }}>
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="pagination-wb">
                                <div className="pagination-info">
                                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} entries
                                </div>
                                <div className="pagination-controls-wb">
                                    <button
                                        className="page-btn-wb"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= page - 2 && pageNum <= page + 2)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`page-btn-wb ${page === pageNum ? 'active' : ''}`}
                                                    onClick={() => setPage(pageNum)}
                                                    aria-current={page === pageNum ? 'page' : undefined}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        if (pageNum === page - 3 || pageNum === page + 3) {
                                            return <span key={pageNum} className="px-1 text-text-muted">…</span>;
                                        }
                                        return null;
                                    })}
                                    <button
                                        className="page-btn-wb"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Products;