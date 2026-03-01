import React, { useState } from 'react';
import Layout from '../components/Layout';
import { bulkAPI, downloadBlob } from '../services/extendedApi';
import './BulkOperations.css';

const BulkOperations = () => {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleProductImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setResult(null);
    try {
      const response = await bulkAPI.importProducts(file);
      setResult(response.data);
      alert(`Imported ${response.data.success} products successfully!`);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleProductExport = async () => {
    try {
      const response = await bulkAPI.exportProducts();
      downloadBlob(response.data, 'products.csv');
      alert('Products exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed');
    }
  };

  const handleCustomerImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const response = await bulkAPI.importCustomers(file);
      alert(`Imported ${response.data.success} customers successfully!`);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleSalesExport = async () => {
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    const endDate = prompt('Enter end date (YYYY-MM-DD):');
    
    if (!startDate || !endDate) return;

    try {
      const response = await bulkAPI.exportSales(startDate, endDate);
      downloadBlob(response.data, 'sales.csv');
      alert('Sales exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed');
    }
  };

  return (
    <Layout>
      <div className="bulk-operations-page">
        <h1>📦 Bulk Operations</h1>

        <div className="operations-grid">
          {/* Product Operations */}
          <div className="operation-card">
            <h2>🏷️ Products</h2>
            <p>Import or export products in bulk using CSV files</p>
            <div className="operation-actions">
              <button className="btn-primary" onClick={handleProductExport}>
                ⬇️ Export Products
              </button>
              <label className="btn-secondary file-input-label">
                ⬆️ Import Products
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleProductImport}
                  disabled={importing}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="csv-format">
              <strong>CSV Format:</strong>
              <pre>name,sku,category,price,cost,quantity,reorder_level,barcode,is_active</pre>
            </div>
          </div>

          {/* Customer Operations */}
          <div className="operation-card">
            <h2>👥 Customers</h2>
            <p>Import customers in bulk using CSV files</p>
            <div className="operation-actions">
              <label className="btn-secondary file-input-label">
                ⬆️ Import Customers
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCustomerImport}
                  disabled={importing}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="csv-format">
              <strong>CSV Format:</strong>
              <pre>name,email,phone,customer_type,address_line1,city,state,postal_code,country</pre>
            </div>
          </div>

          {/* Sales Export */}
          <div className="operation-card">
            <h2>💰 Sales</h2>
            <p>Export sales data for a specific date range</p>
            <div className="operation-actions">
              <button className="btn-primary" onClick={handleSalesExport}>
                ⬇️ Export Sales
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className={`result-box ${result.errors.length > 0 ? 'warning' : 'success'}`}>
            <h3>Import Results</h3>
            <p><strong>Successful:</strong> {result.success}</p>
            {result.errors.length > 0 && (
              <div>
                <strong>Errors:</strong>
                <ul>
                  {result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {importing && (
          <div className="importing-overlay">
            <div className="spinner"></div>
            <p>Importing... Please wait</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BulkOperations;
