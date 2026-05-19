import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { saleAPI, productAPI, handleApiError } from '../services/api';
import './Sales.css';

const Sales = () => {
    const queryClient = useQueryClient();
    const [wizardStep, setWizardStep] = useState(1);
    const [showWizard, setShowWizard] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 20;
    
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        product_id: '',
        quantity: 1,
        unit_price: '',
        payment_method: 'cash',
    });

    const { data: salesRes, isLoading: salesLoading } = useQuery({
        queryKey: ['sales', page],
        queryFn: () => saleAPI.getAll({ page, limit }),
        keepPreviousData: true,
    });

    const { data: productsRes } = useQuery({
        queryKey: ['products-minimal'],
        queryFn: () => productAPI.getAll({ limit: 1000 }),
    });

    const sales = salesRes?.data?.results || salesRes?.data || [];
    const totalCount = salesRes?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const products = productsRes?.data?.results || productsRes?.data || [];

    const createSaleMutation = useMutation({
        mutationFn: (payload) => saleAPI.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['sales']);
            queryClient.invalidateQueries(['products']);
            queryClient.invalidateQueries(['dashboard-metrics']);
            setShowWizard(false);
            setWizardStep(1);
            setFormData({
                customer_name: '',
                customer_email: '',
                product_id: '',
                quantity: 1,
                unit_price: '',
                payment_method: 'cash',
            });
        },
        onError: (err) => alert(`Transaction Failed: ${handleApiError(err).message}`)
    });

    const handleProductChange = (e) => {
        const id = e.target.value;
        const p = products.find(prod => prod.id.toString() === id);
        setFormData({ ...formData, product_id: id, unit_price: p ? p.price : '' });
    };

    const handleFinalize = () => {
        const p = products.find(prod => prod.id.toString() === formData.product_id);
        const available = p?.inventory?.available_quantity || 0;
        
        if (parseInt(formData.quantity) > available) {
            alert(`Insufficient Stock: Only ${available} units of ${p.name} are available.`);
            return;
        }

        const payload = {
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            payment_method: formData.payment_method,
            items: [{
                product: parseInt(formData.product_id),
                quantity: parseInt(formData.quantity),
                unit_price: parseFloat(formData.unit_price)
            }]
        };
        createSaleMutation.mutate(payload);
    };

    const selectedProduct = products.find(p => p.id.toString() === formData.product_id);
    const subtotal = (parseFloat(formData.unit_price) || 0) * (parseInt(formData.quantity) || 0);

    return (
        <Layout>
            <div className="sales-page">
                <header className="page-header-wb">
                    <div className="header-title-area">
                        <h1>Sales <span className="text-primary">Orders</span></h1>
                        <p className="text-secondary">{totalCount} transactions recorded</p>
                    </div>
                    <button className="btn-workbench btn-primary-wb" onClick={() => { setShowWizard(!showWizard); setWizardStep(1); }}>
                        {showWizard ? '✕ Cancel' : '➕ New Sale'}
                    </button>
                </header>

                {showWizard && (
                    <div className="wizard-container animate-entrance">
                        <div className="wizard-header">
                            <span className="text-sm font-bold opacity-60 uppercase tracking-wider">New Sale</span>
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
                                    <span className="step-title-wb">Customer Details</span>
                                    <span className="step-desc-wb">Enter the customer information.</span>
                                    <div className="wizard-form-grid">
                                        <div className="form-group-wb">
                                            <label className="label-wb">Customer Name</label>
                                            <input 
                                                className="input-wb" 
                                                value={formData.customer_name}
                                                onChange={e => setFormData({...formData, customer_name: e.target.value})}
                                                placeholder="e.g. Acme Corp"
                                            />
                                        </div>
                                        <div className="form-group-wb">
                                            <label className="label-wb">Contact Email</label>
                                            <input 
                                                className="input-wb" 
                                                value={formData.customer_email}
                                                onChange={e => setFormData({...formData, customer_email: e.target.value})}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {wizardStep === 2 && (
                                <div>
                                    <span className="step-title-wb">Product Selection</span>
                                    <span className="step-desc-wb">Select the product and specify quantity.</span>
                                    <div className="form-group-wb mb-6">
                                        <label className="label-wb">Product</label>
                                        <select className="input-wb" value={formData.product_id} onChange={handleProductChange}>
                                            <option value="">Select an asset...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} - ${p.price} ({p.inventory?.available_quantity || 0} in stock)
                                                </option>
                                            ))}
                                        </select>
                                        {selectedProduct && (
                                            <div className="mt-2 text-xs">
                                                <span className={`font-bold ${selectedProduct.inventory?.available_quantity > 0 ? 'text-success' : 'text-danger'}`}>
                                                    Available: {selectedProduct.inventory?.available_quantity || 0} units
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="wizard-form-grid">
                                        <div className="form-group-wb">
                                            <label className="label-wb">Quantity</label>
                                            <input 
                                                type="number" 
                                                className={`input-wb ${selectedProduct && parseInt(formData.quantity) > (selectedProduct.inventory?.available_quantity || 0) ? 'border-danger' : ''}`} 
                                                value={formData.quantity} 
                                                onChange={e => setFormData({...formData, quantity: e.target.value})} 
                                            />
                                            {selectedProduct && parseInt(formData.quantity) > (selectedProduct.inventory?.available_quantity || 0) && (
                                                <span className="text-[10px] text-danger font-bold mt-1">Exceeds available stock!</span>
                                            )}
                                        </div>
                                        <div className="form-group-wb">
                                            <label className="label-wb">Unit Price ($)</label>
                                            <input type="number" className="input-wb" value={formData.unit_price} onChange={e => setFormData({...formData, unit_price: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {wizardStep === 3 && (
                                <div>
                                    <span className="step-title-wb">Review & Confirm</span>
                                    <span className="step-desc-wb">Review the order details before submitting.</span>
                                    <div className="review-summary-wb">
                                        <div className="review-row">
                                            <span className="review-label">Customer</span>
                                            <span className="review-value">{formData.customer_name || 'Walk-in Customer'}</span>
                                        </div>
                                        <div className="review-row">
                                            <span className="review-label">Product</span>
                                            <span className="review-value">{selectedProduct?.name || 'N/A'}</span>
                                        </div>
                                        <div className="review-row">
                                            <span className="review-label">Quantity</span>
                                            <span className="review-value">{formData.quantity} units</span>
                                        </div>
                                        <div className="review-row">
                                            <span className="review-label">Payment Method</span>
                                            <span className="review-value uppercase text-primary font-bold">{formData.payment_method}</span>
                                        </div>
                                        <div className="total-review-wb">
                                            <span className="total-label-wb">Order Total</span>
                                            <span className="total-value-wb">${subtotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="wizard-footer">
                            <button className="btn-workbench btn-secondary-wb" disabled={wizardStep === 1} onClick={() => setWizardStep(wizardStep - 1)}>
                                Previous
                            </button>
                            {wizardStep < 3 ? (
                                <button className="btn-workbench btn-primary-wb" disabled={wizardStep === 2 && !formData.product_id} onClick={() => setWizardStep(wizardStep + 1)}>
                                    Next Step
                                </button>
                            ) : (
                                <button className="btn-workbench btn-primary-wb" onClick={handleFinalize} disabled={createSaleMutation.isLoading}>
                                    {createSaleMutation.isPending ? 'Submitting...' : 'Submit Sale'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="sales-ledger-container">
                    {salesLoading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="spinner"></div>
                            <p className="mt-4 text-text-muted text-sm">Loading sales...</p>
                        </div>
                    ) : (
                        <>
                            <table className="wb-table">
                                <thead>
                                    <tr>
                                        <th>Invoice #</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Method</th>
                                        <th>Total</th>
                                        <th className="text-right px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-24 text-text-muted italic">No transactions logged.</td></tr>
                                    ) : (
                                        sales.map((sale) => (
                                            <tr key={sale.id}>
                                                <td><span className="invoice-id-wb">{sale.sale_number}</span></td>
                                                <td>
                                                    <div className="product-info-cell">
                                                        <span className="product-name-wb">{sale.customer_name || 'Walk-in'}</span>
                                                        <span className="text-[10px] text-text-muted">{sale.customer_email || 'No email'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-xs font-semibold">{new Date(sale.sale_date).toLocaleDateString()}</div>
                                                    <div className="text-[10px] text-text-muted">{new Date(sale.sale_date).toLocaleTimeString()}</div>
                                                </td>
                                                <td><span className="text-[10px] font-bold uppercase">{sale.payment_method}</span></td>
                                                <td><div className="text-sm font-black text-success">+${parseFloat(sale.total).toLocaleString()}</div></td>
                                                <td className="text-right px-4">
                                                    <span className={`status-pill ${sale.status === 'completed' ? 'status-success-wb' : 'status-warning-wb'}`}>
                                                        {sale.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <div className="pagination-wb">
                                <div className="pagination-info">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} sales</div>
                                <div className="pagination-controls-wb">
                                    <button className="page-btn-wb" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i+1} 
                                            className={`page-btn-wb ${page === i+1 ? 'active' : ''}`}
                                            onClick={() => setPage(i+1)}
                                        >
                                            {i+1}
                                        </button>
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

export default Sales;