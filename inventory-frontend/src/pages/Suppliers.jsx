import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supplierAPI, handleApiError } from '../services/api';
import './Suppliers.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address_line1: '',
    payment_terms: 'Net 30',
    lead_time_days: 7,
    is_active: true,
    notes: '',
    website: '',
    tax_id: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setShowBulkActions(selectedSuppliers.length > 0);
  }, [selectedSuppliers]);

  const fetchSuppliers = async () => {
    try {
      setError(null);
      const response = await supplierAPI.getAll();
      console.log('API Response:', response.data);
      setSuppliers(response.data.results || response.data || []);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        lead_time_days: parseInt(formData.lead_time_days),
      };
      
      if (editingSupplier) {
        await supplierAPI.update(editingSupplier.id, payload);
      } else {
        await supplierAPI.create(payload);
      }
      setShowForm(false);
      setEditingSupplier(null);
      resetForm();
      fetchSuppliers();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address_line1: '',
      payment_terms: 'Net 30',
      lead_time_days: 7,
      is_active: true,
      notes: '',
      website: '',
      tax_id: '',
    });
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name || '',
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address_line1: supplier.address_line1 || '',
      payment_terms: supplier.payment_terms || 'Net 30',
      lead_time_days: supplier.lead_time_days || 7,
      is_active: supplier.is_active !== undefined ? supplier.is_active : true,
      notes: supplier.notes || '',
      website: supplier.website || '',
      tax_id: supplier.tax_id || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingSupplier(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await supplierAPI.delete(id);
      fetchSuppliers();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleStatusToggle = async (supplier) => {
    try {
      await supplierAPI.update(supplier.id, {
        name: supplier.name,
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address_line1: supplier.address_line1 || '',
        payment_terms: supplier.payment_terms || 'Net 30',
        lead_time_days: supplier.lead_time_days || 7,
        notes: supplier.notes || '',
        website: supplier.website || '',
        tax_id: supplier.tax_id || '',
        is_active: !supplier.is_active
      });
      fetchSuppliers();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleSelectSupplier = (supplierId) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSuppliers.length === filteredSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(filteredSuppliers.map(s => s.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedSuppliers.length} suppliers?`)) return;
    try {
      await Promise.all(selectedSuppliers.map(id => supplierAPI.delete(id)));
      setSelectedSuppliers([]);
      fetchSuppliers();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleBulkStatusChange = async (isActive) => {
    try {
      const updates = selectedSuppliers.map(id => {
        const supplier = suppliers.find(s => s.id === id);
        return supplierAPI.update(id, {
          name: supplier.name,
          contact_person: supplier.contact_person || '',
          email: supplier.email || '',
          phone: supplier.phone || '',
          address_line1: supplier.address_line1 || '',
          payment_terms: supplier.payment_terms || 'Net 30',
          lead_time_days: supplier.lead_time_days || 7,
          notes: supplier.notes || '',
          website: supplier.website || '',
          tax_id: supplier.tax_id || '',
          is_active: isActive
        });
      });
      await Promise.all(updates);
      setSelectedSuppliers([]);
      fetchSuppliers();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleDuplicate = (supplier) => {
    setEditingSupplier(null);
    setFormData({
      name: `${supplier.name} (Copy)`,
      contact_person: supplier.contact_person || '',
      email: '',
      phone: '',
      address_line1: supplier.address_line1 || '',
      payment_terms: supplier.payment_terms || 'Net 30',
      lead_time_days: supplier.lead_time_days || 7,
      is_active: true,
      notes: supplier.notes || '',
      website: supplier.website || '',
      tax_id: supplier.tax_id || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Contact Person', 'Email', 'Phone', 'Payment Terms', 'Lead Time', 'Status'];
    const csvData = filteredSuppliers.map(s => [
      s.name,
      s.contact_person || '',
      s.email || '',
      s.phone || '',
      s.payment_terms,
      `${s.lead_time_days} days`,
      s.is_active ? 'Active' : 'Inactive'
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPaymentTerms('');
    setSelectedStatus('');
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPaymentTerms = selectedPaymentTerms === '' || supplier.payment_terms === selectedPaymentTerms;
    const matchesStatus = selectedStatus === '' || 
                          (selectedStatus === 'active' && supplier.is_active) ||
                          (selectedStatus === 'inactive' && !supplier.is_active);
    return matchesSearch && matchesPaymentTerms && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading suppliers...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Suppliers</h1>
          <p>Manage your product suppliers ({filteredSuppliers.length} suppliers)</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={exportToCSV}>
            📊 Export CSV
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingSupplier(null);
              resetForm();
            }}
          >
            {showForm ? '✕ Close' : '+ Add Supplier'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card form-card">
          <h3>{editingSupplier ? 'Edit Supplier' : 'New Supplier'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  className="form-input"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address_line1"
                className="form-textarea"
                rows="2"
                value={formData.address_line1}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Website</label>
                <input
                  type="url"
                  name="website"
                  className="form-input"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tax ID</label>
                <input
                  type="text"
                  name="tax_id"
                  className="form-input"
                  value={formData.tax_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Payment Terms</label>
                <select
                  name="payment_terms"
                  className="form-select"
                  value={formData.payment_terms}
                  onChange={handleInputChange}
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on receipt">Due on receipt</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lead Time (days)</label>
                <input
                  type="number"
                  name="lead_time_days"
                  className="form-input"
                  value={formData.lead_time_days}
                  onChange={handleInputChange}
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                className="form-textarea"
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes about this supplier..."
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                Active Supplier
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingSupplier ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search suppliers by name, contact, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={selectedPaymentTerms}
          onChange={(e) => setSelectedPaymentTerms(e.target.value)}
        >
          <option value="">All Payment Terms</option>
          <option value="Net 15">Net 15</option>
          <option value="Net 30">Net 30</option>
          <option value="Net 45">Net 45</option>
          <option value="Net 60">Net 60</option>
          <option value="Due on receipt">Due on receipt</option>
          <option value="COD">Cash on Delivery</option>
        </select>
        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {showBulkActions && (
        <div className="bulk-actions">
          <span>{selectedSuppliers.length} suppliers selected</span>
          <div className="bulk-buttons">
            <button className="btn btn-sm btn-success" onClick={() => handleBulkStatusChange(true)}>
              Activate
            </button>
            <button className="btn btn-sm btn-warning" onClick={() => handleBulkStatusChange(false)}>
              Deactivate
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedSuppliers.length === filteredSuppliers.length && filteredSuppliers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Company</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Payment Terms</th>
              <th>Lead Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className={selectedSuppliers.includes(supplier.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.includes(supplier.id)}
                      onChange={() => handleSelectSupplier(supplier.id)}
                    />
                  </td>
                  <td>
                    <div className="supplier-info">
                      <strong>{supplier.name}</strong>
                      {supplier.website && (
                        <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="website-link">
                          🌐
                        </a>
                      )}
                    </div>
                  </td>
                  <td>{supplier.contact_person || '-'}</td>
                  <td>
                    {supplier.email ? (
                      <a href={`mailto:${supplier.email}`} className="email-link">
                        {supplier.email}
                      </a>
                    ) : '-'}
                  </td>
                  <td>
                    {supplier.phone ? (
                      <a href={`tel:${supplier.phone}`} className="phone-link">
                        {supplier.phone}
                      </a>
                    ) : '-'}
                  </td>
                  <td>{supplier.payment_terms}</td>
                  <td>{supplier.lead_time_days} days</td>
                  <td>
                    <button
                      className={`status-toggle ${supplier.is_active ? 'active' : 'inactive'}`}
                      onClick={() => handleStatusToggle(supplier)}
                      title={`Click to ${supplier.is_active ? 'deactivate' : 'activate'}`}
                    >
                      {supplier.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(supplier)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDuplicate(supplier)}
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(supplier.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Suppliers;