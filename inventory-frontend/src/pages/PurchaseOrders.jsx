import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { purchaseOrderAPI, supplierAPI, productAPI, handleApiError } from '../services/api';
import './Products.css';
import './Sales.css';

const PurchaseOrders = () => {
    const queryClient = useQueryClient();
    const [wizardStep, setWizardStep] = useState(1);
    const [showWizard, setShowWizard] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 20;

    const [formData, setFormData] = useState({
        supplier: '',
        expected_date: '',
        notes: '',
        shipping_cost: 0,
        tax: 0,
        items: [{ product: '', quantity: 1, unit_price: 0 }],
    });

    const { data: ordersRes, isLoading: ordersLoading } = useQuery({
        queryKey: ['purchase-orders', page],
        queryFn: () => purchaseOrderAPI.getAll(page, limit),
        keepPreviousData: true,
    });

    const { data: suppliersRes } = useQuery({ queryKey: ['suppliers-minimal'], queryFn: () => supplierAPI.getAll({ limit: 1000 }) });
    const { data: productsRes } = useQuery({ queryKey: ['products-minimal'], queryFn: () => productAPI.getAll({ limit: 1000 }) });

    const orders = ordersRes?.data?.results || ordersRes?.data || [];
    const totalCount = ordersRes?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const suppliers = suppliersRes?.data?.results || suppliersRes?.data || [];
    const products = productsRes?.data?.results || productsRes?.data || [];

    const createMutation = useMutation({
        mutationFn: (data) => purchaseOrderAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['purchase-orders']);
            setShowWizard(false);
            setWizardStep(1);
            resetForm();
        },
        onError: (err) => alert(`Action Failed: ${handleApiError(err).message}`)
    });

    const resetForm = () => {
        setFormData({
            supplier: '', expected_date: '', notes: '',
            shipping_cost: 0, tax: 0,
            items: [{ product: '', quantity: 1, unit_price: 0 }],
        });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({ ...prev, items: [...prev.items, { product: '', quantity: 1, unit_price: 0 }] }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const calculateTotal = () => {
        const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        return subtotal + parseFloat(formData.shipping_cost || 0) + parseFloat(formData.tax || 0);
    };

    const receiveMutation = useMutation({
        mutationFn: (id) => purchaseOrderAPI.receiveAll(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['purchase-orders']);
            alert('Order successfully marked as received!');
        },
        onError: (err) => alert(`Action Failed: ${handleApiError(err).message}`)
    });

    const handleReceiveOrder = (id) => {
        if (window.confirm('Are you sure you want to mark all items in this order as received? This will update your inventory quantities.')) {
            receiveMutation.mutate(id);
        }
    };

    return (
        <Layout>
            <div className="products-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Purchase <span className="text-primary">Orders</span></h1>
                        <p className="text-secondary">{totalCount} orders in progress</p>
                    </div>
                    <button className="btn-workbench btn-primary-wb" onClick={() => { setShowWizard(!showWizard); setWizardStep(1); }}>
                        {showWizard ? '✕ Cancel' : '➕ New Purchase Order'}
                    </button>
                </header>

                {showWizard && (
                    <div className="wizard-container animate-entrance">
                        <div className="wizard-header">
                            <span className="text-sm font-bold opacity-60 uppercase tracking-wider">New Purchase Order</span>
                            <div className="wizard-steps-indicator">
                                <div className={`step-bubble ${wizardStep >= 1 ? 'active' : ''} ${wizardStep > 1 ? 'complete' : ''}`}>1</div>
                                <div className="step-line"></div>
                                <div className={`step-bubble ${wizardStep >= 2 ? 'active' : ''} ${wizardStep > 2 ? 'complete' : ''}`}>2</div>
                                <div className="step-line"></div>
                                <div className={`step-bubble ${wizardStep >= 3 ? 'active' : ''}`}>3</div>
                            </div>
                        </div>

                        <div className="wizard-body">
                            {wizardStep === 1 && (
                                <div>
                                    <span className="step-title-wb">Supplier & Delivery</span>
                                    <span className="step-desc-wb">Select supplier and expected delivery date.</span>
                                    <div className="wizard-form-grid">
                                        <div className="form-group-wb">
                                            <label className="label-wb">Primary Supplier</label>
                                            <select className="input-wb" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})}>
                                                <option value="">Select a partner...</option>
                                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group-wb">
                                            <label className="label-wb">Expected Arrival</label>
                                            <input type="date" className="input-wb" value={formData.expected_date} onChange={e => setFormData({...formData, expected_date: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {wizardStep === 2 && (
                                <div>
                                    <span className="step-title-wb">Line Items</span>
                                    <span className="step-desc-wb">Products to be ordered.</span>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                        {formData.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-end bg-secondary-light p-4 rounded-lg">
                                                <div className="flex-1">
                                                    <label className="label-wb mb-2 block">Product</label>
                                                    <select className="input-wb w-full" value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)}>
                                                        <option value="">Select product...</option>
                                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="w-24">
                                                    <label className="label-wb mb-2 block">Qty</label>
                                                    <input type="number" className="input-wb w-full" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} />
                                                </div>
                                                <div className="w-32">
                                                    <label className="label-wb mb-2 block">Unit Cost</label>
                                                    <input type="number" className="input-wb w-full" value={item.unit_price} onChange={e => handleItemChange(idx, 'unit_price', e.target.value)} />
                                                </div>
                                                <button className="icon-action-btn delete" onClick={() => removeItem(idx)}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn-workbench btn-secondary-wb w-full mt-4 border-dashed" onClick={addItem}>+ Add Line Item</button>
                                </div>
                            )}

                            {wizardStep === 3 && (
                                <div>
                                    <span className="step-title-wb">Review & Submit</span>
                                    <span className="step-desc-wb">Final costs and order summary.</span>
                                    <div className="wizard-form-grid mb-6">
                                        <div className="form-group-wb">
                                            <label className="label-wb">Shipping Cost</label>
                                            <input type="number" className="input-wb" value={formData.shipping_cost} onChange={e => setFormData({...formData, shipping_cost: e.target.value})} />
                                        </div>
                                        <div className="form-group-wb">
                                            <label className="label-wb">Tax</label>
                                            <input type="number" className="input-wb" value={formData.tax} onChange={e => setFormData({...formData, tax: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="review-summary-wb">
                                        <div className="review-row">
                                            <span className="review-label">Supplier</span>
                                            <span className="review-value">{suppliers.find(s => s.id.toString() === formData.supplier)?.name || 'N/A'}</span>
                                        </div>
                                        <div className="review-row">
                                            <span className="review-label">Items</span>
                                            <span className="review-value">{formData.items.length} Line Items</span>
                                        </div>
                                        <div className="total-review-wb">
                                            <span className="total-label-wb">Order Total</span>
                                            <span className="total-value-wb">${calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="wizard-footer">
                            <button className="btn-workbench btn-secondary-wb" disabled={wizardStep === 1} onClick={() => setWizardStep(wizardStep - 1)}>Previous</button>
                            {wizardStep < 3 ? (
                                <button 
                                    className="btn-workbench btn-primary-wb" 
                                    onClick={() => setWizardStep(wizardStep + 1)}
                                    disabled={
                                        (wizardStep === 1 && (!formData.supplier || !formData.expected_date)) ||
                                        (wizardStep === 2 && (formData.items.length === 0 || formData.items.some(item => !item.product || item.quantity <= 0)))
                                    }
                                >Next Step</button>
                            ) : (
                                <button className="btn-workbench btn-primary-wb" onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
                                    Submit Order
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="data-table-container">
                    {ordersLoading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="spinner"></div>
                            <p className="mt-4 text-text-muted text-sm">Loading orders...</p>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Supplier</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th className="text-right px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td><span className="invoice-id-wb">{o.order_number}</span></td>
                                            <td><span className="product-name-wb">{o.supplier_name}</span></td>
                                            <td>
                                                <span className={`status-pill ${o.status === 'received' ? 'status-success-wb' : 'status-warning-wb'}`}>
                                                    {o.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td><div className="text-sm font-black text-primary">${parseFloat(o.total_amount).toLocaleString()}</div></td>
                                            <td className="px-4">
                                                <div className="action-row-wb justify-end gap-2 flex">
                                                    {o.status !== 'received' && (
                                                        <button 
                                                            className="btn-workbench btn-secondary-wb text-xs px-2 py-1" 
                                                            onClick={() => handleReceiveOrder(o.id)}
                                                            disabled={receiveMutation.isPending}
                                                            title="Mark as Received"
                                                        >
                                                            ✓ Mark Received
                                                        </button>
                                                    )}
                                                    <button className="icon-action-btn" title="View Details">👁️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-wb">
                                <div className="pagination-info">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} orders</div>
                                <div className="pagination-controls-wb">
                                    <button className="page-btn-wb" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i+1} className={`page-btn-wb ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
                                    )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
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

export default PurchaseOrders;