import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { productAPI } from '../services/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getAll();
      const productData = response.data.results || response.data;
      setProducts(productData);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError('Failed to load inventory data.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalItems = products.length;
  const lowStockItems = products.filter(
    (p) => p.inventory && p.inventory.available_quantity <= p.inventory.reorder_level
  ).length;
  const inventoryValue = products.reduce((total, p) => {
    const qty = p.inventory ? p.inventory.available_quantity : 0;
    const price = parseFloat(p.price) || 0;
    return total + (qty * price);
  }, 0);

  return (
    <Layout>
      <div className="page-header">
        <h1>Inventory</h1>
        <p>Track and manage your stock levels</p>
      </div>

      {error && (
        <div className="alert alert-error mb-4" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading inventory data...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-value">{totalItems}</div>
                <div className="stat-label">Total Items</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <div className="stat-value">{lowStockItems}</div>
                <div className="stat-label">Low Stock</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">${inventoryValue.toFixed(2)}</div>
                <div className="stat-label">Inventory Value</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Inventory List</h3>
              <button className="btn btn-outline" onClick={fetchInventory}>↻ Refresh</button>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Available Quantity</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const qty = product.inventory ? product.inventory.available_quantity : 0;
                    const reorderLevel = product.inventory ? product.inventory.reorder_level : 0;
                    const location = product.inventory ? product.inventory.location : 'N/A';
                    
                    let statusBadge = <span className="badge badge-success">In Stock</span>;
                    if (qty <= 0) {
                      statusBadge = <span className="badge badge-danger">Out of Stock</span>;
                    } else if (qty <= reorderLevel) {
                      statusBadge = <span className="badge badge-warning">Low Stock</span>;
                    }

                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{qty}</td>
                        <td>{location}</td>
                        <td>{statusBadge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Inventory;