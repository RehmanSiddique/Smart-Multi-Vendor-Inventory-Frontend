import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { customerAPI } from '../services/extendedApi';
import { handleApiError } from '../services/api';
import './Products.css';

const Customers = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 20;

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', customer_type: 'retail',
        address_line1: '', city: '', state: '', postal_code: '', country: 'USA'
    });

    const { data: customerRes, isLoading } = useQuery({
        queryKey: ['customers', page],
        queryFn: () => customerAPI.getAll({ page, limit }),
        keepPreviousData: true,
    });

    const customers = customerRes?.data?.results || customerRes?.data || [];
    const totalCount = customerRes?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const saveMutation = useMutation({
        mutationFn: (data) => editingCustomer ? customerAPI.update(editingCustomer.id, data) : customerAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['customers']);
            setShowForm(false);
            setEditingCustomer(null);
            resetForm();
        },
        onError: (err) => alert(`Save failed: ${handleApiError(err).message}`)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => customerAPI.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['customers']),
    });

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', customer_type: 'retail', address_line1: '', city: '', state: '', postal_code: '', country: 'USA' });
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name || '', email: customer.email || '', phone: customer.phone || '',
            customer_type: customer.customer_type || 'retail', address_line1: customer.address_line1 || '',
            city: customer.city || '', state: customer.state || '', postal_code: customer.postal_code || '',
            country: customer.country || 'USA'
        });
        setShowForm(true);
    };

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Customer <span className="text-primary">Directory</span></h1>
                        <p className="text-secondary">{totalCount} registered customers</p>
                    </div>
                    <button className="btn-workbench btn-primary-wb" onClick={() => { resetForm(); setEditingCustomer(null); setShowForm(true); }}>
                        ➕ Add Customer
                    </button>
                </header>

                {showForm && (
                    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                        <div className="modal-content modal-content-lg">
                            <div className="modal-header">
                                <div>
                                    <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
                                    <p>Enter the customer information below.</p>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowForm(false)}>✕</button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group-wb">
                                        <label className="label-wb">Full Name / Business</label>
                                        <input className="input-wb" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Email Address</label>
                                        <input type="email" className="input-wb" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Phone Number</label>
                                        <input className="input-wb" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                    <div className="form-group-wb">
                                        <label className="label-wb">Customer Type</label>
                                        <select className="input-wb" value={formData.customer_type} onChange={e => setFormData({...formData, customer_type: e.target.value})}>
                                            <option value="retail">Retail</option>
                                            <option value="wholesale">Wholesale</option>
                                            <option value="vip">VIP</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group-wb mb-6">
                                    <label className="label-wb">Address</label>
                                    <input className="input-wb w-full" value={formData.address_line1} onChange={e => setFormData({...formData, address_line1: e.target.value})} placeholder="Street address" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-workbench btn-secondary-wb" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn-workbench btn-primary-wb" disabled={saveMutation.isPending}>
                                        {editingCustomer ? 'Save Changes' : 'Add Customer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="data-table-container">
                    {isLoading ? (
                        <div className="empty-state"><div className="spinner"></div><p className="mt-4 text-text-muted text-sm">Loading customers...</p></div>
                    ) : customers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">👥</div>
                            <div className="empty-state-title">No customers yet</div>
                            <div className="empty-state-desc">Add your first customer to start tracking sales.</div>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Type</th>
                                        <th>Total Spent</th>
                                        <th className="text-right px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(c => (
                                        <tr key={c.id}>
                                            <td>
                                                <div className="product-info-cell">
                                                    <span className="product-name-wb">{c.name}</span>
                                                    <span className="text-xs text-text-muted">{c.city || 'No location'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm font-semibold">{c.email || '—'}</div>
                                                <div className="text-xs text-text-muted">{c.phone || '—'}</div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${c.customer_type === 'vip' ? 'status-success-wb' : 'status-warning-wb'}`}>
                                                    {c.customer_type?.charAt(0).toUpperCase() + c.customer_type?.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-sm font-bold text-primary">${parseFloat(c.total_spent || 0).toLocaleString()}</div>
                                                <div className="text-xs text-text-muted">{c.total_orders || 0} orders</div>
                                            </td>
                                            <td className="px-4">
                                                <div className="action-row-wb">
                                                    <button className="icon-action-btn" title="Edit" onClick={() => handleEdit(c)}>✏️</button>
                                                    <button className="icon-action-btn delete" title="Delete" onClick={() => { if(window.confirm('Delete this customer?')) deleteMutation.mutate(c.id); }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-wb">
                                <div className="pagination-info">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} customers</div>
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

export default Customers;
