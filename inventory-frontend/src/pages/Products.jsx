import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { productAPI, categoryAPI, handleApiError } from '../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Debug effect to log data when it changes
  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      console.log('📊 Products loaded:', products.length);
      console.log('📊 Categories loaded:', categories.length);
    }
  }, [products, categories]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setCategories(categoriesRes.data.results || categoriesRes.data || []);
      setProducts(productsRes.data.results || productsRes.data || []);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching data:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔄 Input change - ${name}:`, value, `(type: ${typeof value})`);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Log form data before processing
    console.log('🔍 Raw form data:', formData);
    
    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      price: parseFloat(formData.price),
      description: formData.description?.trim() || ''
    };
    
    // CRITICAL FIX: Handle category with explicit type conversion
    if (formData.category && formData.category !== '' && formData.category !== 'null') {
      let categoryValue = formData.category;
      
      // If it's an array (shouldn't happen but let's be safe)
      if (Array.isArray(categoryValue)) {
        categoryValue = categoryValue[0];
        console.log('⚠️ Fixed array category:', categoryValue);
      }
      
      // Convert to integer
      const categoryId = parseInt(categoryValue, 10);
      
      if (!isNaN(categoryId) && categoryId > 0) {
        // Ensure it's a plain integer, not an array or object
        payload.category = categoryId;
        console.log('✅ Category set as integer:', categoryId);
      } else {
        console.log('❌ Invalid category value:', categoryValue);
      }
    }
    
    // Final payload validation
    console.log('📦 Final payload:', payload);
    console.log('📦 Category type check:', typeof payload.category);
    
    // Double-check that category is not an array
    if (payload.category && Array.isArray(payload.category)) {
      console.error('🚨 CRITICAL: Category is still an array!', payload.category);
      payload.category = parseInt(payload.category[0], 10);
      console.log('🔧 Fixed to:', payload.category);
    }
    
    try {
      if (editingProduct) {
        const response = await productAPI.update(editingProduct.id, payload);
        console.log('✅ Product updated:', response.data);
      } else {
        const response = await productAPI.create(payload);
        console.log('✅ Product created:', response.data);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', sku: '', price: '', category: '', description: '' });
      await fetchData();
    } catch (err) {
      console.error('❌ Product submit error:', err);
      console.error('❌ Error response:', err.response?.data);
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleEdit = (product) => {
    console.log('🔧 Editing product:', product);
    setEditingProduct(product);
    
    // Handle category properly - extract ID if it's an object or array
    let categoryValue = '';
    if (product.category) {
      console.log('🔍 Product category type:', typeof product.category, product.category);
      
      if (Array.isArray(product.category)) {
        categoryValue = product.category[0]?.id || product.category[0] || '';
        console.log('⚠️ Category is array, extracted:', categoryValue);
      } else if (typeof product.category === 'object' && product.category !== null) {
        categoryValue = product.category.id || '';
        console.log('📝 Category is object, extracted ID:', categoryValue);
      } else {
        categoryValue = product.category;
        console.log('🔢 Category is primitive:', categoryValue);
      }
    }
    
    const formDataToSet = {
      name: product.name || '',
      sku: product.sku || '',
      price: product.price || '',
      category: String(categoryValue), // Ensure it's always a string
      description: product.description || '',
    };
    
    console.log('📝 Form data to set:', formDataToSet);
    
    setFormData(formDataToSet);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', sku: '', price: '', category: '', description: '' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setShowLowStock(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      fetchData();
    } catch (err) {
      const apiError = handleApiError(err);
      
      // Check if it's the specific error about products with sales
      if (err.response?.status === 400 && err.response?.data?.error?.includes('Cannot delete product that has been sold')) {
        alert(
          'Cannot Delete Product\n\n' +
          'This product cannot be deleted because it appears in sales records. ' +
          'To maintain data integrity, products with sales history must be preserved.\n\n' +
          'Suggestion: You can mark this product as inactive to hide it from listings.'
        );
      } else {
        alert(`Error deleting product: ${apiError.message}`);
      }
    }
  };

  const getStockStatus = (product) => {
    const qty = product.inventory?.quantity || 0;
    const reorder = product.inventory?.reorder_level || 0;
    if (qty === 0) return { text: 'Out of Stock', className: 'badge-danger' };
    if (qty <= reorder) return { text: 'Low Stock', className: 'badge-warning' };
    return { text: 'In Stock', className: 'badge-success' };
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category comparison - both should be integers now
    const matchesCategory = selectedCategory === '' || 
                           String(p.category) === String(selectedCategory);
    
    const matchesLowStock = !showLowStock || (p.inventory?.quantity || 0) <= (p.inventory?.reorder_level || 0);
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
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
          <h1>Products</h1>
          <p>Manage your product inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
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
              <label className="form-label">SKU *</label>
              <input
                type="text"
                name="sku"
                className="form-input"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price *</label>
              <input
                type="number"
                name="price"
                className="form-input"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
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
          placeholder="Search by name or SKU"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={e => setShowLowStock(e.target.checked)}
          />
          Show Low Stock Only
        </label>
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => {
                const status = getStockStatus(p);
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.category_name || '-'}</td>
                    <td>${p.price}</td>
                    <td>{p.inventory?.quantity || 0}</td>
                    <td>
                      <span className={`badge ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(p)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Products;