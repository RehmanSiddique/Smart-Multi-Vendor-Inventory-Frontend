import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { categoryAPI, handleApiError } from '../services/api';
import './Products.css';

const Categories = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 20;

    const [formData, setFormData] = useState({
        name: '', description: '', parent: '', is_active: true
    });

    const { data: categoryRes, isLoading } = useQuery({
        queryKey: ['categories', page],
        queryFn: () => categoryAPI.getAll({ page, limit }),
        keepPreviousData: true,
    });

    const categories = categoryRes?.data?.results || categoryRes?.data || [];
    const totalCount = categoryRes?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const saveMutation = useMutation({
        mutationFn: (payload) => editingCategory ? categoryAPI.update(editingCategory.id, payload) : categoryAPI.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setShowForm(false);
            setEditingCategory(null);
            resetForm();
        },
        onError: (err) => alert(`Save failed: ${handleApiError(err).message}`)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => categoryAPI.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['categories']),
    });

    const resetForm = () => {
        setFormData({ name: '', description: '', parent: '', is_active: true });
    };

    const handleEdit = (c) => {
        setEditingCategory(c);
        setFormData({ name: c.name || '', description: c.description || '', parent: c.parent || '', is_active: c.is_active !== false });
        setShowForm(true);
    };

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Product <span className="text-primary">Categories</span></h1>
                        <p className="text-secondary">{totalCount} categories defined</p>
                    </div>
                    <button className="btn-workbench btn-primary-wb" onClick={() => { resetForm(); setEditingCategory(null); setShowForm(true); }}>
                        ➕ Add Category
                    </button>
                </header>

                {showForm && (
                    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <div>
                                    <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                                    <p>Define a product classification.</p>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowForm(false)}>✕</button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Category Name</label>
                                        <input className="input-wb" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Parent Category</label>
                                        <select className="input-wb" value={formData.parent} onChange={e => setFormData({...formData, parent: e.target.value})}>
                                            <option value="">None (Top Level)</option>
                                            {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group-wb mb-6">
                                    <label className="label-wb">Description</label>
                                    <textarea className="input-wb w-full" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description..." />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-workbench btn-secondary-wb" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn-workbench btn-primary-wb" disabled={saveMutation.isPending}>
                                        {editingCategory ? 'Save Changes' : 'Add Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="data-table-container">
                    {isLoading ? (
                        <div className="empty-state"><div className="spinner"></div><p className="mt-4 text-text-muted text-sm">Loading categories...</p></div>
                    ) : categories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📁</div>
                            <div className="empty-state-title">No categories yet</div>
                            <div className="empty-state-desc">Create your first category to organize products.</div>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Parent</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th className="text-right px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(c => (
                                        <tr key={c.id}>
                                            <td><span className="product-name-wb">{c.name}</span></td>
                                            <td><span className="text-xs font-semibold text-secondary">{c.parent_name || 'Root'}</span></td>
                                            <td><div className="text-sm text-text-muted truncate max-w-xs">{c.description || '—'}</div></td>
                                            <td><span className={`status-pill ${c.is_active ? 'status-success-wb' : 'status-danger-wb'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                                            <td className="px-4">
                                                <div className="action-row-wb">
                                                    <button className="icon-action-btn" title="Edit" onClick={() => handleEdit(c)}>✏️</button>
                                                    <button className="icon-action-btn delete" title="Delete" onClick={() => { if(window.confirm('Delete this category?')) deleteMutation.mutate(c.id); }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-wb">
                                <div className="pagination-info">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount}</div>
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

export default Categories;