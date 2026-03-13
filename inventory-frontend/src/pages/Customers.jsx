import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { customerAPI } from '../services/extendedApi';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    customer_type: 'retail',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA'
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerAPI.getAll();
      const customerData = response.data.results || response.data;
      setCustomers(Array.isArray(customerData) ? customerData : []);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      customer_type: 'retail',
      address_line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'USA'
    });
    setCurrentCustomerId(null);
    setIsEditMode(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (customer) => {
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      customer_type: customer.customer_type || 'retail',
      address_line1: customer.address_line1 || '',
      city: customer.city || '',
      state: customer.state || '',
      postal_code: customer.postal_code || '',
      country: customer.country || 'USA'
    });
    setCurrentCustomerId(customer.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await customerAPI.update(currentCustomerId, formData);
      } else {
        await customerAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error);
      alert('Failed to save customer. Please check the console for details.');
    }
  };

  const confirmDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await customerAPI.delete(customerToDelete.id);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      loadCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Failed to delete customer');
    }
  };

  return (
    <Layout>
      <div className="customers-page">
        <div className="page-header">
          <h1>👥 Customers</h1>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <span>+</span> Add Customer
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading customers...</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-container">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Total Spent</th>
                    <th>Orders</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer.id}>
                        <td><strong>{customer.name}</strong></td>
                        <td>{customer.email || 'N/A'}</td>
                        <td>{customer.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge badge-${customer.customer_type}`}>
                            {customer.customer_type}
                          </span>
                        </td>
                        <td>${parseFloat(customer.total_spent || 0).toFixed(2)}</td>
                        <td>{customer.total_orders || 0}</td>
                        <td style={{ textAlign: 'right' }} className="actions-cell">
                          <button 
                            className="btn btn-sm btn-outline" 
                            onClick={() => handleOpenEditModal(customer)}
                            style={{ marginRight: '8px' }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => confirmDelete(customer)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                          No customers found. Click <strong>"+ Add Customer"</strong> to create one.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="555-0123"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      className="form-control"
                      value={formData.customer_type}
                      onChange={(e) => setFormData({...formData, customer_type: e.target.value})}
                    >
                      <option value="retail">Retail</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123 Main St"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                  />
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Save Changes' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: '#dc2626' }}>Confirm Delete</h2>
              <p>Are you sure you want to delete <strong>{customerToDelete?.name}</strong>? This action cannot be undone.</p>
              <div className="form-actions" style={{ justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" id="confirm-delete-btn" onClick={handleDelete}>
                  Yes, Delete Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Customers;
