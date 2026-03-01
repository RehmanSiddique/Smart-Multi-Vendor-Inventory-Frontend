import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { promotionAPI } from '../services/extendedApi';
import './Promotions.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const response = await promotionAPI.getAll();
      setPromotions(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to load promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await promotionAPI.create(formData);
      alert('Promotion created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        start_date: '',
        end_date: '',
        is_active: true
      });
      loadPromotions();
    } catch (error) {
      console.error('Failed to create promotion:', error);
      alert('Failed to create promotion');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await promotionAPI.delete(id);
      alert('Promotion deleted!');
      loadPromotions();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete promotion');
    }
  };

  return (
    <Layout>
      <div className="promotions-page">
        <div className="page-header">
          <h1>🎉 Promotions & Discounts</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Create Promotion
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="promotions-grid">
            {promotions.map((promo) => (
              <div key={promo.id} className={`promo-card ${promo.is_active ? 'active' : 'inactive'}`}>
                <div className="promo-header">
                  <h3>{promo.name}</h3>
                  <span className={`status-badge ${promo.is_active ? 'active' : 'inactive'}`}>
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="promo-code">Code: <strong>{promo.code}</strong></p>
                <p className="promo-discount">
                  {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `$${promo.discount_value} OFF`}
                </p>
                <p className="promo-dates">
                  {new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}
                </p>
                <button className="btn-delete" onClick={() => handleDelete(promo.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create Promotion</h2>
              <form onSubmit={handleSubmit}>
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
                  <label>Promo Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g., SUMMER2024"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Discount Type *</label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="bogo">Buy One Get One</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      required
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

export default Promotions;
