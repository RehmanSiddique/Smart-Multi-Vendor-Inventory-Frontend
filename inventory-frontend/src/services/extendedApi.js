// src/services/extendedApi.js
import api from './api';

// ============================================================
// ANALYTICS APIS
// ============================================================
export const analyticsAPI = {
  getDashboard: (days = 30) => api.get(`/inventory/extended/analytics/dashboard/?days=${days}`),
  getSalesTrend: (days = 30) => api.get(`/inventory/extended/analytics/sales-trend/?days=${days}`),
  getTopCustomers: (limit = 10) => api.get(`/inventory/extended/analytics/top-customers/?limit=${limit}`),
  getInventoryValuation: () => api.get('/inventory/extended/analytics/inventory-valuation/'),
  getCategoryPerformance: (days = 30) => api.get(`/inventory/extended/analytics/category-performance/?days=${days}`),
  getSupplierPerformance: () => api.get('/inventory/extended/analytics/supplier-performance/'),
};

// ============================================================
// CUSTOMER APIS
// ============================================================
export const customerAPI = {
  getAll: (params) => api.get('/inventory/extended/customers/', { params }),
  getById: (id) => api.get(`/inventory/extended/customers/${id}/`),
  create: (data) => api.post('/inventory/extended/customers/', data),
  update: (id, data) => api.put(`/inventory/extended/customers/${id}/`, data),
  delete: (id) => api.delete(`/inventory/extended/customers/${id}/`),
  getPurchaseHistory: (id) => api.get(`/inventory/extended/customers/${id}/purchase_history/`),
};

// ============================================================
// WAREHOUSE APIS
// ============================================================
export const warehouseAPI = {
  getAll: (params) => api.get('/inventory/extended/warehouses/', { params }),
  getById: (id) => api.get(`/inventory/extended/warehouses/${id}/`),
  create: (data) => api.post('/inventory/extended/warehouses/', data),
  update: (id, data) => api.put(`/inventory/extended/warehouses/${id}/`, data),
  delete: (id) => api.delete(`/inventory/extended/warehouses/${id}/`),
  getInventory: (id) => api.get(`/inventory/extended/warehouses/${id}/inventory/`),
};

// ============================================================
// PROMOTION APIS
// ============================================================
export const promotionAPI = {
  getAll: (params) => api.get('/inventory/extended/promotions/', { params }),
  getActive: () => api.get('/inventory/extended/promotions/active/'),
  getById: (id) => api.get(`/inventory/extended/promotions/${id}/`),
  create: (data) => api.post('/inventory/extended/promotions/', data),
  update: (id, data) => api.put(`/inventory/extended/promotions/${id}/`, data),
  delete: (id) => api.delete(`/inventory/extended/promotions/${id}/`),
};

// ============================================================
// RETURN APIS
// ============================================================
export const returnAPI = {
  getAll: (params) => api.get('/inventory/extended/returns/', { params }),
  getById: (id) => api.get(`/inventory/extended/returns/${id}/`),
  create: (data) => api.post('/inventory/extended/returns/', data),
  approve: (id, restock = false) => api.post(`/inventory/extended/returns/${id}/approve/`, { restock }),
};

// ============================================================
// WEBHOOK APIS
// ============================================================
export const webhookAPI = {
  getAll: (params) => api.get('/inventory/extended/webhooks/', { params }),
  getById: (id) => api.get(`/inventory/extended/webhooks/${id}/`),
  create: (data) => api.post('/inventory/extended/webhooks/', data),
  update: (id, data) => api.put(`/inventory/extended/webhooks/${id}/`, data),
  delete: (id) => api.delete(`/inventory/extended/webhooks/${id}/`),
  test: (id) => api.post(`/inventory/extended/webhooks/${id}/test/`),
};

// ============================================================
// BULK OPERATIONS APIS
// ============================================================
export const bulkAPI = {
  importProducts: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/inventory/extended/bulk/import-products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  exportProducts: () => api.get('/inventory/extended/bulk/export-products/', { responseType: 'blob' }),
  
  updatePrices: (updates) => api.post('/inventory/extended/bulk/update-prices/', { updates }),
  
  adjustInventory: (adjustments) => api.post('/inventory/extended/bulk/adjust-inventory/', { adjustments }),
  
  exportSales: (startDate, endDate) => 
    api.get(`/inventory/extended/bulk/export-sales/?start_date=${startDate}&end_date=${endDate}`, { responseType: 'blob' }),
  
  importCustomers: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/inventory/extended/bulk/import-customers/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ============================================================
// VARIANT APIS
// ============================================================
export const variantAPI = {
  getAll: (params) => api.get('/inventory/extended/variants/', { params }),
  getById: (id) => api.get(`/inventory/extended/variants/${id}/`),
  create: (data) => api.post('/inventory/extended/variants/', data),
  update: (id, data) => api.put(`/inventory/extended/variants/${id}/`, data),
  delete: (id) => api.delete(`/inventory/extended/variants/${id}/`),
};

// ============================================================
// TAG APIS
// ============================================================
export const tagAPI = {
  getAll: (params) => api.get('/inventory/extended/tags/', { params }),
  create: (data) => api.post('/inventory/extended/tags/', data),
  delete: (id) => api.delete(`/inventory/extended/tags/${id}/`),
};

// ============================================================
// AUDIT LOG APIS
// ============================================================
export const auditAPI = {
  getAll: (params) => api.get('/inventory/extended/audit-logs/', { params }),
};

// ============================================================
// UTILITY APIS
// ============================================================
export const utilityAPI = {
  generateBarcode: (code, type = 'code128') => 
    api.post('/inventory/extended/utils/generate-barcode/', { code, type }, { responseType: 'blob' }),
};

// Helper to download blob as file
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
