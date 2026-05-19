import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { warehouseAPI } from '../services/extendedApi';
import { handleApiError } from '../services/api';
import './Products.css';

const Warehouses = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 20;

    const [formData, setFormData] = useState({
        name: '', code: '', address_line1: '', city: '', state: '', 
        country: 'USA', manager_name: '', phone: '', is_active: true
    });

    const { data: warehouseRes, isLoading } = useQuery({
        queryKey: ['warehouses', page],
        queryFn: () => warehouseAPI.getAll({ page, limit }),
        keepPreviousData: true,
    });

    const warehouses = warehouseRes?.data?.results || warehouseRes?.data || [];
    const totalCount = warehouseRes?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const saveMutation = useMutation({
        mutationFn: (data) => editingWarehouse ? warehouseAPI.update(editingWarehouse.id, data) : warehouseAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['warehouses']);
            setShowForm(false);
            setEditingWarehouse(null);
            resetForm();
        },
        onError: (err) => alert(`Save failed: ${handleApiError(err).message}`)
    });

    const resetForm = () => {
        setFormData({
            name: '', code: '', address_line1: '', city: '', state: '', 
            country: 'USA', manager_name: '', phone: '', is_active: true
        });
    };

    const handleEdit = (w) => {
        setEditingWarehouse(w);
        setFormData({
            name: w.name || '', code: w.code || '',
            address_line1: w.address_line1 || '', city: w.city || '',
            state: w.state || '', country: w.country || 'USA',
            manager_name: w.manager_name || '', phone: w.phone || '',
            is_active: w.is_active !== false
        });
        setShowForm(true);
    };

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Warehouse <span className="text-primary">Locations</span></h1>
                        <p className="text-secondary">{totalCount} warehouses registered</p>
                    </div>
                    <button className="btn-workbench btn-primary-wb" onClick={() => { resetForm(); setEditingWarehouse(null); setShowForm(true); }}>
                        ➕ Add Warehouse
                    </button>
                </header>

                {showForm && (
                    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                        <div className="modal-content modal-content-lg">
                            <div className="modal-header">
                                <div>
                                    <h2>{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
                                    <p>Enter the warehouse details below.</p>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowForm(false)}>✕</button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Warehouse Name</label>
                                        <input className="input-wb" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Main Distribution Center" />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Warehouse Code</label>
                                        <input className="input-wb" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required placeholder="WH-001" style={{ fontFamily: 'var(--font-mono)' }} />
                                    </div>
                                </div>
                                <div className="form-group-wb mb-6">
                                    <label className="label-wb">Street Address</label>
                                    <input className="input-wb" value={formData.address_line1} onChange={e => setFormData({...formData, address_line1: e.target.value})} placeholder="123 Industrial Blvd" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">City</label>
                                        <input className="input-wb" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">State</label>
                                        <input className="input-wb" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Country</label>
                                        <input className="input-wb" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Manager Name</label>
                                        <input className="input-wb" value={formData.manager_name} onChange={e => setFormData({...formData, manager_name: e.target.value})} placeholder="John Smith" />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Phone Number</label>
                                        <input className="input-wb" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 555 000-0000" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-workbench btn-secondary-wb" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn-workbench btn-primary-wb" disabled={saveMutation.isPending}>
                                        {editingWarehouse ? 'Save Changes' : 'Add Warehouse'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="data-table-container">
                    {isLoading ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p className="mt-4 text-text-muted text-sm">Loading warehouses...</p>
                        </div>
                    ) : warehouses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🏢</div>
                            <div className="empty-state-title">No warehouses found</div>
                            <div className="empty-state-desc">Add your first warehouse to manage inventory locations.</div>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Location</th>
                                        <th>Manager</th>
                                        <th>Status</th>
                                        <th className="text-right px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warehouses.map(w => (
                                        <tr key={w.id}>
                                            <td><span className="product-name-wb">{w.name}</span></td>
                                            <td><span className="sku-badge-wb">{w.code}</span></td>
                                            <td>
                                                <div className="text-sm font-semibold">{w.city || 'Not specified'}</div>
                                                <div className="text-xs text-text-muted">{w.state || '—'}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm font-semibold">{w.manager_name || '—'}</div>
                                                <div className="text-xs text-text-muted">{w.phone || '—'}</div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${w.is_active ? 'status-success-wb' : 'status-danger-wb'}`}>
                                                    {w.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4">
                                                <div className="action-row-wb">
                                                    <button className="icon-action-btn" title="Edit" onClick={() => handleEdit(w)}>✏️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-wb">
                                <div className="pagination-info">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} warehouses</div>
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

export default Warehouses;
