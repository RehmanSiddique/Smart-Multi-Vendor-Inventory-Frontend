import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { categoryAPI, productAPI, handleApiError } from '../services/api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'tree'
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [parentFilter, setParentFilter] = useState('');
  
  // Bulk actions
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      const data = response.data.results || response.data || [];
      setCategories(data);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      is_active: formData.is_active
    };
    
    if (formData.parent && formData.parent !== '') {
      payload.parent = parseInt(formData.parent);
    }
    
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, payload);
      } else {
        await categoryAPI.create(payload);
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', parent: '', is_active: true });
      fetchCategories();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    
    let parentValue = '';
    if (category.parent) {
      if (Array.isArray(category.parent)) {
        parentValue = category.parent[0]?.id || category.parent[0] || '';
      } else if (typeof category.parent === 'object' && category.parent !== null) {
        parentValue = category.parent.id || '';
      } else {
        parentValue = category.parent;
      }
    }
    
    setFormData({
      name: category.name || '',
      description: category.description || '',
      parent: String(parentValue),
      is_active: category.is_active !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      fetchCategories();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleDuplicate = async (category) => {
    const payload = {
      name: `${category.name} (Copy)`,
      description: category.description || '',
      parent: category.parent || null,
      is_active: true
    };
    
    try {
      await categoryAPI.create(payload);
      fetchCategories();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const toggleCategoryStatus = async (id) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    try {
      await categoryAPI.update(id, { is_active: !category.is_active });
      fetchCategories();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedCategories.length} categories?`)) return;
    
    try {
      await Promise.all(selectedCategories.map(id => categoryAPI.delete(id)));
      setSelectedCategories([]);
      fetchCategories();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleBulkToggleStatus = async (status) => {
    try {
      await Promise.all(selectedCategories.map(id => 
        categoryAPI.update(id, { is_active: status })
      ));
      setSelectedCategories([]);
      fetchCategories();
    } catch (err) {
      const apiError = handleApiError(err);
      alert(`Error: ${apiError.message}`);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCategories(filteredCategories.map(c => c.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (id, checked) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, id]);
    } else {
      setSelectedCategories(prev => prev.filter(cId => cId !== id));
    }
  };

  const exportCategories = () => {
    const csvContent = [
      ['Name', 'Description', 'Parent', 'Products', 'Status'],
      ...filteredCategories.map(c => [
        c.name,
        c.description || '',
        c.parent_name || '',
        c.product_count || 0,
        c.is_active ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories.csv';
    a.click();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setShowActiveOnly(false);
    setParentFilter('');
  };

  // Filter categories
  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = !showActiveOnly || c.is_active;
    const matchesParent = parentFilter === '' || c.parent == parentFilter;
    return matchesSearch && matchesActive && matchesParent;
  });

  // Tree view component
  const CategoryTree = ({ categories, level = 0 }) => {
    const topLevel = categories.filter(c => !c.parent);
    
    return (
      <div className="category-tree">
        {topLevel.map(category => (
          <CategoryTreeNode 
            key={category.id} 
            category={category} 
            categories={categories}
            level={level}
          />
        ))}
      </div>
    );
  };

  const CategoryTreeNode = ({ category, categories, level }) => {
    const children = categories.filter(c => c.parent === category.id);
    const [expanded, setExpanded] = useState(true);
    
    return (
      <div className="tree-node">
        <div 
          className="tree-item" 
          style={{ marginLeft: `${level * 20}px` }}
        >
          {children.length > 0 && (
            <button 
              className="tree-toggle"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
          <span className="tree-name">{category.name}</span>
          <span className="tree-count">({category.product_count || 0})</span>
          <div className="tree-actions">
            <button className="btn-icon" onClick={() => handleEdit(category)}>✏️</button>
            <button className="btn-icon" onClick={() => handleDelete(category.id)}>🗑️</button>
          </div>
        </div>
        {expanded && children.length > 0 && (
          <div className="tree-children">
            {children.map(child => (
              <CategoryTreeNode
                key={child.id}
                category={child}
                categories={categories}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading categories...</p>
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
          <h1>Categories</h1>
          <p>Organize your products with categories</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={exportCategories}>
            📊 Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingCategory(null);
              setFormData({ name: '', description: '', parent: '', is_active: true });
            }}
          >
            {showForm ? '✕ Close' : '+ Add Category'}
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCategories.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedCategories.length} selected</span>
          <div className="bulk-actions">
            <button className="btn btn-sm" onClick={() => handleBulkToggleStatus(true)}>
              Activate
            </button>
            <button className="btn btn-sm" onClick={() => handleBulkToggleStatus(false)}>
              Deactivate
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card form-card">
          <h3>{editingCategory ? 'Edit Category' : 'New Category'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
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
                <label className="form-label">Parent Category</label>
                <select
                  name="parent"
                  className="form-select"
                  value={formData.parent}
                  onChange={handleInputChange}
                >
                  <option value="">None (Top Level)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
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
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={parentFilter}
          onChange={e => setParentFilter(e.target.value)}
        >
          <option value="">All Parents</option>
          {categories.filter(c => !c.parent).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={e => setShowActiveOnly(e.target.checked)}
          />
          Active Only
        </label>
        <div className="view-toggle">
          <button 
            className={`btn btn-sm ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            📋 Table
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => setViewMode('tree')}
          >
            🌳 Tree
          </button>
        </div>
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {/* Content */}
      {viewMode === 'tree' ? (
        <div className="tree-container">
          <CategoryTree categories={filteredCategories} />
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th>Name</th>
                <th>Description</th>
                <th>Parent</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={e => handleSelectCategory(category.id, e.target.checked)}
                      />
                    </td>
                    <td>{category.name}</td>
                    <td>{category.description || '-'}</td>
                    <td>{category.parent_name || '-'}</td>
                    <td>
                      <span className="product-count">
                        {category.product_count || 0}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${category.is_active ? 'active' : 'inactive'}`}
                        onClick={() => toggleCategoryStatus(category.id)}
                      >
                        {category.is_active ? '✓ Active' : '✗ Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(category)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDuplicate(category)}
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(category.id)}
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
      )}
    </Layout>
  );
};

export default Categories;