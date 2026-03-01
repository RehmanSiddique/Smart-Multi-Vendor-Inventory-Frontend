import React, { useState } from 'react';
import Layout from '../components/Layout';

const Sales = () => {
  const [showForm, setShowForm] = useState(false);

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

      {showForm && (
        <div className="card form-card">
          <h3>Record New Sale</h3>
          <form>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input type="text" className="form-input" placeholder="Enter customer name" />
              </div>
              <div className="form-group">
                <label className="form-label">Customer Email</label>
                <input type="email" className="form-input" placeholder="customer@example.com" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product</label>
              <select className="form-select">
                <option value="">Select Product</option>
                <option value="1">MacBook Pro 14</option>
                <option value="2">iPhone 15 Pro</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input type="number" className="form-input" min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price</label>
                <input type="number" className="form-input" step="0.01" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-select">
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Record Sale</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Recent Sales</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>INV-20240227-001</td>
                <td>John Doe</td>
                <td>2024-02-27</td>
                <td>2</td>
                <td>$2,499.98</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
              <tr>
                <td>INV-20240226-001</td>
                <td>Jane Smith</td>
                <td>2024-02-26</td>
                <td>1</td>
                <td>$999.99</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Sales;