import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { saleAPI, productAPI } from '../services/api';

const Sales = () => {
  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    product_id: '',
    quantity: 1,
    unit_price: '',
    payment_method: 'cash',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, productsRes] = await Promise.all([
        saleAPI.getAll(),
        productAPI.getAll()
      ]);
      
      // The backend uses pagination, so unwrap `.results` if present.
      setSales(salesRes.data.results || salesRes.data);
      setProducts(productsRes.data.results || productsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Failed to load sales data.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
    
    setFormData({
      ...formData,
      product_id: selectedProductId,
      // Auto-fill price if a product is selected
      unit_price: selectedProduct ? selectedProduct.price : '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.product_id || !formData.quantity || !formData.unit_price) {
      alert("Please fill in all product related fields.");
      return;
    }

    try {
      setLoading(true);
      // Construct payload according to backend Serializer mapping
      const payload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        payment_method: formData.payment_method,
        items: [
          {
            product: parseInt(formData.product_id),
            quantity: parseInt(formData.quantity),
            unit_price: parseFloat(formData.unit_price)
          }
        ]
      };

      await saleAPI.create(payload);
      
      // Reset form and refetch data
      setFormData({
        customer_name: '',
        customer_email: '',
        product_id: '',
        quantity: 1,
        unit_price: '',
        payment_method: 'cash',
      });
      setShowForm(false);
      await fetchData();
    } catch (err) {
      console.error("Failed to create sale", err);
      alert("Failed to record the sale. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Sales</h1>
          <p>Record and manage your sales transactions</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close' : '+ New Sale'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card form-card mb-4">
          <h3>Record New Sale</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input 
                  type="text" 
                  name="customer_name"
                  className="form-input" 
                  placeholder="Enter customer name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Customer Email</label>
                <input 
                  type="email" 
                  name="customer_email"
                  className="form-input" 
                  placeholder="customer@example.com"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product</label>
              <select 
                className="form-select"
                name="product_id"
                value={formData.product_id}
                onChange={handleProductChange}
                required
              >
                <option value="">Select Product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.inventory ? product.inventory.available_quantity : 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input 
                  type="number" 
                  name="quantity"
                  className="form-input" 
                  min="1" 
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price ($)</label>
                <input 
                  type="number" 
                  name="unit_price"
                  className="form-input" 
                  step="0.01" 
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select 
                className="form-select"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
              >
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Recording...' : 'Record Sale'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Recent Sales</h3>
        {loading && !showForm ? (
          <p>Loading sales data...</p>
        ) : sales.length === 0 ? (
          <p>No sales recorded yet.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.sale_number}</td>
                    <td>{sale.customer_name || 'Walk-in Customer'}</td>
                    <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                    <td>${parseFloat(sale.total).toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${sale.status === 'completed' ? 'success' : 'warning'}`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sales;