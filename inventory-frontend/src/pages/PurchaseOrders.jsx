import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { purchaseOrderAPI, supplierAPI, productAPI, handleApiError } from '../services/api';
import './PurchaseOrders.css';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    expected_date: '',
    notes: '',
    shipping_cost: 0,
    tax: 0,
    items: [{ product: '', quantity: 1, unit_price: '' }],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setShowBulkActions(selectedOrders.length > 0);
  }, [selectedOrders]);

  const fetchData = async () => {
    try {
      setError(null);
      const [ordersRes, suppliersRes, productsRes] = await Promise.all([
        purchaseOrderAPI.getAll(),
        supplierAPI.getAll(),
        productAPI.getAll(),
      ]);
      setOrders(ordersRes.data.results || ordersRes.data || []);
      setSuppliers(suppliersRes.data.results || suppliersRes.data || []);
      setProducts(productsRes.data.results || productsRes.data || []);
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1, unit_price: '' }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        shipping_cost: parseFloat(formData.shipping_cost) || 0,
        tax: parseFloat(formData.tax) || 0,
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price)
        }))
      };
      
      if (editingOrder) {
        await purchaseOrderAPI.update(editingOrder.id, payload);
      } else {
        await purchaseOrderAPI.create(payload);
      }
      
      setShowForm(false);
      setEditingOrder(null);
      resetForm();
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      supplier: '',
      expected_date: '',
      notes: '',
      shipping_cost: 0,
      tax: 0,
      items: [{ product: '', quantity: 1, unit_price: '' }],
    });
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      supplier: order.supplier || '',
      expected_date: order.expected_date ? order.expected_date.split('T')[0] : '',
      notes: order.notes || '',
      shipping_cost: order.shipping_cost || 0,
      tax: order.tax || 0,
      items: order.items?.length > 0 ? order.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unit_price: item.unit_price
      })) : [{ product: '', quantity: 1, unit_price: '' }],
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
    try {
      await purchaseOrderAPI.delete(id);
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await purchaseOrderAPI.update(orderId, { status: newStatus });
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedOrders.length} orders?`)) return;
    try {
      await Promise.all(selectedOrders.map(id => purchaseOrderAPI.delete(id)));
      setSelectedOrders([]);
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      await Promise.all(selectedOrders.map(id => 
        purchaseOrderAPI.update(id, { status: newStatus })
      ));
      setSelectedOrders([]);
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order Number', 'Supplier', 'Status', 'Order Date', 'Expected Date', 'Total Amount'];
    const csvData = filteredOrders.map(o => [
      o.order_number,
      o.supplier_name,
      o.status_display,
      new Date(o.order_date).toLocaleDateString(),
      o.expected_date ? new Date(o.expected_date).toLocaleDateString() : '',
      `$${o.total_amount}`
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSupplier('');
    setSelectedStatus('');
  };

  const handleReceive = async (orderId, itemId, quantity) => {
    try {
      await purchaseOrderAPI.receiveItem(orderId, itemId, quantity);
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleReceiveAll = async (orderId) => {
    try {
      await purchaseOrderAPI.receiveAll(orderId);
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = selectedSupplier === '' || order.supplier == selectedSupplier;
    const matchesStatus = selectedStatus === '' || order.status === selectedStatus;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge-secondary',
      sent: 'badge-info',
      confirmed: 'badge-primary',
      shipped: 'badge-warning',
      received: 'badge-success',
      cancelled: 'badge-danger',
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading purchase orders...</p>
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
          <h1>Purchase Orders</h1>
          <p>Manage orders to suppliers ({filteredOrders.length} orders)</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={exportToCSV}>
            📊 Export CSV
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingOrder(null);
              resetForm();
            }}
          >
            {showForm ? '✕ Close' : '+ New Purchase Order'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card form-card">
          <h3>{editingOrder ? 'Edit Purchase Order' : 'Create Purchase Order'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Supplier *</label>
                <select
                  name="supplier"
                  className="form-select"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expected Date</label>
                <input
                  type="date"
                  name="expected_date"
                  className="form-input"
                  value={formData.expected_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Items *</label>
              <div className="items-container">
                {formData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <select
                      className="form-select"
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - {p.sku}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Unit Price"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                    <span className="item-total">
                      ${((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
                    </span>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon btn-danger"
                        onClick={() => removeItem(index)}
                        title="Remove Item"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={addItem}
                >
                  + Add Item
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Shipping Cost</label>
                <input
                  type="number"
                  name="shipping_cost"
                  className="form-input"
                  value={formData.shipping_cost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tax</label>
                <input
                  type="number"
                  name="tax"
                  className="form-input"
                  value={formData.tax}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
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
                placeholder="Additional notes for this order..."
              />
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${formData.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unit_price || 0)), 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>${(formData.shipping_cost || 0)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${(formData.tax || 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(formData.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unit_price || 0)), 0) + parseFloat(formData.shipping_cost || 0) + parseFloat(formData.tax || 0)).toFixed(2)}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingOrder ? 'Update Order' : 'Create Order'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingOrder(null);
                  resetForm();
                }}
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
          placeholder="Search by order number or supplier"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          <option value="">All Suppliers</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="partial">Partially Received</option>
          <option value="received">Fully Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {showBulkActions && (
        <div className="bulk-actions">
          <span>{selectedOrders.length} orders selected</span>
          <div className="bulk-buttons">
            <button className="btn btn-sm btn-primary" onClick={() => handleBulkStatusChange('confirmed')}>
              Mark Confirmed
            </button>
            <button className="btn btn-sm btn-warning" onClick={() => handleBulkStatusChange('cancelled')}>
              Cancel Orders
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
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Order #</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Expected Date</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  No purchase orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className={selectedOrders.includes(order.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </td>
                  <td>
                    <strong>{order.order_number}</strong>
                  </td>
                  <td>{order.supplier_name}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusBadge(order.status)}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="partial">Partially Received</option>
                      <option value="received">Fully Received</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>
                    {order.expected_date ? new Date(order.expected_date).toLocaleDateString() : '-'}
                  </td>
                  <td>${order.total_amount}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(order)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      {order.status !== 'received' && order.items?.some(item => item.quantity_received < item.quantity) && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleReceiveAll(order.id)}
                          title="Receive All"
                        >
                          📦
                        </button>
                      )}
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(order.id)}
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

export default PurchaseOrders;