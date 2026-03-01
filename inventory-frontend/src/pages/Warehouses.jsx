import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { warehouseAPI } from '../services/extendedApi';
import './Warehouses.css';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address_line1: '',
    city: '',
    state: '',
    country: 'USA',
    manager_name: '',
    phone: '',
    is_active: true
  });

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const response = await warehouseAPI.getAll();
      setWarehouses(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await warehouseAPI.create(formData);
      alert('Warehouse created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        address_line1: '',
        city: '',
        state: '',
        country: 'USA',
        manager_name: '',
        phone: '',
        is_active: true
      });
      loadWarehouses();
    } catch (error) {
      console.error('Failed to create warehouse:', error);
      alert('Failed to create warehouse');
    }
  };

  return (
    <Layout>
      <div className="warehouses-page">
        <div className="page-header">
          <h1>🏭 Warehouses</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Warehouse
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="warehouses-grid">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="warehouse-card">
                <h3>{warehouse.name}</h3>
                <p className="warehouse-code">Code: {warehouse.code}</p>
                <p className="warehouse-location">
                  📍 {warehouse.city}, {warehouse.state}
                </p>
                <p className="warehouse-manager">
                  👤 Manager: {warehouse.manager_name || 'N/A'}
                </p>
                <p className="warehouse-phone">
                  📞 {warehouse.phone || 'N/A'}
                </p>
                <span className={`status-badge ${warehouse.is_active ? 'active' : 'inactive'}`}>
                  {warehouse.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add Warehouse</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Manager Name</label>
                    <input
                      type="text"
                      value={formData.manager_name}
                      onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Warehouses;
