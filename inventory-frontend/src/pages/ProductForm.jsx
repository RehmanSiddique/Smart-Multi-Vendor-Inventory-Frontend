import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, categoryAPI, supplierAPI, handleApiError } from '../services/api';
import { warehouseAPI } from '../services/extendedApi';

const ProductForm = ({ initialData, onComplete, onCancel }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(initialData || {
    name: '', sku: '', category: '', supplier: '',
    price: 0, cost: 0, reorder_level: 5,
    description: '', is_active: true, barcode: '',
    warehouse: '', length: 0, width: 0, height: 0, weight: 0
  });

  const { data: catRes } = useQuery({ queryKey: ['categories'], queryFn: () => categoryAPI.getAll() });
  const { data: supRes } = useQuery({ queryKey: ['suppliers'], queryFn: () => supplierAPI.getAll() });
  const { data: whRes } = useQuery({ queryKey: ['warehouses'], queryFn: () => warehouseAPI.getAll() });

  const categories = catRes?.data?.results || catRes?.data || [];
  const suppliers = supRes?.data?.results || supRes?.data || [];
  const warehouses = whRes?.data?.results || whRes?.data || [];

  const saveMutation = useMutation({
    mutationFn: (data) => initialData ? productAPI.update(initialData.id, data) : productAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      onComplete();
    },
    onError: (err) => alert(`Save failed: ${handleApiError(err).message}`)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      reorder_level: parseInt(formData.reorder_level),
      length: parseFloat(formData.length || 0),
      width: parseFloat(formData.width || 0),
      height: parseFloat(formData.height || 0),
      weight: parseFloat(formData.weight || 0),
    };
    saveMutation.mutate(payload);
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: '📋' },
    { id: 'financials', label: 'Pricing & Stock', icon: '💰' },
    { id: 'logistics', label: 'Logistics', icon: '🚛' },
  ];

  return (
    <div>
      <div className="modal-header">
        <div>
          <h2>{initialData ? 'Edit Product' : 'Add New Product'}</h2>
          <p>{initialData ? 'Update the product details below.' : 'Fill in the details to add a new product.'}</p>
        </div>
        <button className="modal-close-btn" onClick={onCancel} aria-label="Close">✕</button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className="pb-3 px-4 text-xs font-bold transition-all border-b-2"
            style={{
              borderColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
              cursor: 'pointer',
              padding: '0.75rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s ease',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group-wb">
              <label className="label-wb">Product Name</label>
              <input className="input-wb" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Enter product name" />
            </div>
            <div className="form-group-wb">
              <label className="label-wb">SKU</label>
              <input className="input-wb font-mono" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required placeholder="Unique identifier" />
            </div>
            <div className="form-group-wb">
              <label className="label-wb">Category</label>
              <select className="input-wb" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Uncategorized</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group-wb">
              <label className="label-wb">Supplier</label>
              <select className="input-wb" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})}>
                <option value="">None</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group-wb md:col-span-2">
              <label className="label-wb">Description</label>
              <textarea className="input-wb w-full" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Product description..." />
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group-wb">
              <label className="label-wb">Cost Price ($)</label>
              <input type="number" step="0.01" className="input-wb" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
            </div>
            <div className="form-group-wb">
              <label className="label-wb">Selling Price ($)</label>
              <input type="number" step="0.01" className="input-wb" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="form-group-wb">
              <label className="label-wb">Reorder Level</label>
              <input type="number" className="input-wb" value={formData.reorder_level} onChange={e => setFormData({...formData, reorder_level: e.target.value})} />
            </div>
            <div className="form-group-wb md:col-span-2">
              <label className="label-wb">Barcode / EAN</label>
              <input className="input-wb" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} placeholder="Optional barcode" />
            </div>
            <div className="form-group-wb flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                <span className="text-sm font-bold">Active Product</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="space-y-6">
            <div className="form-group-wb">
              <label className="label-wb">Warehouse</label>
              <select className="input-wb w-full" value={formData.warehouse} onChange={e => setFormData({...formData, warehouse: e.target.value})}>
                <option value="">Select warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="form-group-wb">
                <label className="label-wb">Length (cm)</label>
                <input type="number" step="0.1" className="input-wb" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} />
              </div>
              <div className="form-group-wb">
                <label className="label-wb">Width (cm)</label>
                <input type="number" step="0.1" className="input-wb" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} />
              </div>
              <div className="form-group-wb">
                <label className="label-wb">Height (cm)</label>
                <input type="number" step="0.1" className="input-wb" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
              </div>
              <div className="form-group-wb">
                <label className="label-wb">Weight (kg)</label>
                <input type="number" step="0.1" className="input-wb" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button type="button" className="btn-workbench btn-secondary-wb" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-workbench btn-primary-wb" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
