import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { supplierAPI, handleApiError } from '../services/api';
import './Products.css';

const Suppliers = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 15;

    const [formData, setFormData] = useState({
        name: '', contact_person: '', email: '', phone: '',
        address_line1: '', payment_terms: 'Net 30',
        lead_time_days: 7, is_active: true, notes: '',
        website: '', tax_id: '',
    });

    const { data: supplierRes, isLoading } = useQuery({
        queryKey: ['suppliers', page],
        queryFn: () => supplierAPI.getAll({ page, limit }),
        keepPreviousData: true,
    });

    const suppliers = supplierRes?.data?.results || supplierRes?.data || [];
    const totalCount = supplierRes?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const saveMutation = useMutation({
        mutationFn: (payload) => editingSupplier ? supplierAPI.update(editingSupplier.id, payload) : supplierAPI.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['suppliers']);
            setShowForm(false);
            setEditingSupplier(null);
            resetForm();
        },
        onError: (err) => alert(`Save failed: ${handleApiError(err).message}`)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => supplierAPI.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['suppliers']),
    });

    const resetForm = () => {
        setFormData({
            name: '', contact_person: '', email: '', phone: '',
            address_line1: '', payment_terms: 'Net 30',
            lead_time_days: 7, is_active: true, notes: '',
            website: '', tax_id: '',
        });
    };

    const handleEdit = (s) => {
        setEditingSupplier(s);
        setFormData({
            name: s.name || '', contact_person: s.contact_person || '',
            email: s.email || '', phone: s.phone || '',
            address_line1: s.address_line1 || '', payment_terms: s.payment_terms || 'Net 30',
            lead_time_days: s.lead_time_days || 7, is_active: s.is_active !== false,
            notes: s.notes || '', website: s.website || '', tax_id: s.tax_id || '',
        });
        setShowForm(true);
    };

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Supplier <span className="text-primary">Network</span></h1>
                        <p className="text-secondary">{totalCount} active suppliers</p>
                    </div>
                    <button className="btn-workbench btn-primary-wb" onClick={() => { resetForm(); setEditingSupplier(null); setShowForm(true); }}>
                        ➕ Add Supplier
                    </button>
                </header>

                {/* Modal Form */}
                {showForm && (
                    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                        <div className="modal-content modal-content-lg">
                            <div className="modal-header">
                                <div>
                                    <h2>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                                    <p>Fill in the supplier details below.</p>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowForm(false)}>✕</button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Business Name</label>
                                        <input type="text" className="input-wb" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Company name" />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Contact Person</label>
                                        <input type="text" className="input-wb" value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} placeholder="Full name" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Email Address</label>
                                        <input type="email" className="input-wb" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@company.com" />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Phone Number</label>
                                        <input type="text" className="input-wb" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Payment Terms</label>
                                        <select className="input-wb" value={formData.payment_terms} onChange={e => setFormData({...formData, payment_terms: e.target.value})}>
                                            <option value="Net 15">Net 15</option>
                                            <option value="Net 30">Net 30</option>
                                            <option value="Net 45">Net 45</option>
                                            <option value="Due on receipt">Due on Receipt</option>
                                        </select>
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Lead Time (Days)</label>
                                        <input type="number" className="input-wb" value={formData.lead_time_days} onChange={e => setFormData({...formData, lead_time_days: e.target.value})} />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Tax ID</label>
                                        <input type="text" className="input-wb" value={formData.tax_id} onChange={e => setFormData({...formData, tax_id: e.target.value})} placeholder="VAT / Tax Reg #" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-workbench btn-secondary-wb" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn-workbench btn-primary-wb" disabled={saveMutation.isPending}>
                                        {saveMutation.isPending ? 'Saving...' : 'Save Supplier'}
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
                            <p className="mt-4 text-text-muted text-sm">Loading suppliers...</p>
                        </div>
                    ) : suppliers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🤝</div>
                            <div className="empty-state-title">No suppliers found</div>
                            <div className="empty-state-desc">Add your first supplier to get started.</div>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Supplier</th>
                                        <th>Contact</th>
                                        <th>Payment Terms</th>
                                        <th>Lead Time</th>
                                        <th>Status</th>
                                        <th className="text-right px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map(s => (
                                        <tr key={s.id}>
                                            <td>
                                                <div className="product-info-cell">
                                                    <span className="product-name-wb">{s.name}</span>
                                                    <span className="product-sku-wb">{s.website || 'No website'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm font-semibold">{s.contact_person || 'N/A'}</div>
                                                <div className="text-xs text-text-muted">{s.email || '—'}</div>
                                            </td>
                                            <td>
                                                <span className="text-xs font-bold uppercase text-text-muted">{s.payment_terms}</span>
                                            </td>
                                            <td>
                                                <span className="font-bold">{s.lead_time_days}</span>
                                                <span className="text-xs text-text-muted ml-auto"> days</span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${s.is_active ? 'status-success-wb' : 'status-danger-wb'}`}>
                                                    {s.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4">
                                                <div className="action-row-wb">
                                                    <button className="icon-action-btn" onClick={() => handleEdit(s)}>✏️</button>
                                                    <button className="icon-action-btn delete" onClick={() => { if(window.confirm('Delete this supplier?')) deleteMutation.mutate(s.id); }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="pagination-wb">
                                <div className="pagination-info">
                                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} suppliers
                                </div>
                                <div className="pagination-controls-wb">
                                    <button className="page-btn-wb" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)) {
                                            return <button key={p} className={`page-btn-wb ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>;
                                        }
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

export default Suppliers;