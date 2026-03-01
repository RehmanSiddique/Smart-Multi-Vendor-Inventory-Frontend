// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    console.error(`❌ API Error: ${error.config?.url} - Status: ${error.response?.status}`, error.response?.data);
    return Promise.reject(error);
  }
);

// ============================================================
// AUTHENTICATION APIS
// ============================================================
export const authAPI = {
  login: (email, password) => api.post('/auth/login/', { email, password }),
  register: (userData) => api.post('/auth/register/', userData),
  refresh: (refresh) => api.post('/auth/refresh/', { refresh }),
  verify: (token) => api.post('/auth/verify/', { token }),
  getProfile: () => api.get('/accounts/users/me/'),
  updateProfile: (data) => api.patch('/accounts/users/me/', data),
};

// ============================================================
// CATEGORY APIS
// ============================================================
export const categoryAPI = {
  getAll: () => api.get('/inventory/categories/'),
  getById: (id) => api.get(`/inventory/categories/${id}/`),
  create: (data) => api.post('/inventory/categories/', data),
  update: (id, data) => api.put(`/inventory/categories/${id}/`, data),
  delete: (id) => api.delete(`/inventory/categories/${id}/`),
  getProducts: (id) => api.get(`/inventory/categories/${id}/products/`),
  getTree: (id) => api.get(`/inventory/categories/${id}/tree/`),
};

// ============================================================
// PRODUCT APIS
// ============================================================
export const productAPI = {
  getAll: (params = {}) => api.get('/inventory/products/', { params }),
  getById: (id) => api.get(`/inventory/products/${id}/`),
  create: (data) => api.post('/inventory/products/', data),
  update: (id, data) => api.put(`/inventory/products/${id}/`, data),
  delete: (id) => api.delete(`/inventory/products/${id}/`),
  getInventory: (id) => api.get(`/inventory/products/${id}/inventory/`),
  getLowStock: () => api.get('/inventory/products/low_stock/'),
  updateInventory: (id, data) => api.patch(`/inventory/products/${id}/inventory/`, data),
};

// ============================================================
// SUPPLIER APIS
// ============================================================
export const supplierAPI = {
  getAll: () => api.get('/inventory/suppliers/'),
  getById: (id) => api.get(`/inventory/suppliers/${id}/`),
  create: (data) => api.post('/inventory/suppliers/', data),
  update: (id, data) => api.put(`/inventory/suppliers/${id}/`, data),
  delete: (id) => api.delete(`/inventory/suppliers/${id}/`),
  getPurchaseOrders: (id) => api.get(`/inventory/suppliers/${id}/purchase_orders/`),
};

// ============================================================
// PURCHASE ORDER APIS
// ============================================================
export const purchaseOrderAPI = {
  getAll: () => api.get('/inventory/purchase-orders/'),
  getById: (id) => api.get(`/inventory/purchase-orders/${id}/`),
  create: (data) => api.post('/inventory/purchase-orders/', data),
  update: (id, data) => api.put(`/inventory/purchase-orders/${id}/`, data),
  delete: (id) => api.delete(`/inventory/purchase-orders/${id}/`),
  receiveItem: (id, itemId, quantity) => 
    api.post(`/inventory/purchase-orders/${id}/receive_item/`, { 
      item_id: itemId, 
      quantity: quantity 
    }),
  receiveAll: (id) => api.post(`/inventory/purchase-orders/${id}/receive_all/`),
};

// ============================================================
// SALE APIS
// ============================================================
export const saleAPI = {
  getAll: () => api.get('/inventory/sales/'),
  getById: (id) => api.get(`/inventory/sales/${id}/`),
  create: (data) => api.post('/inventory/sales/', data),
  update: (id, data) => api.put(`/inventory/sales/${id}/`, data),
  delete: (id) => api.delete(`/inventory/sales/${id}/`),
  getToday: () => api.get('/inventory/sales/today/'),
  getRange: (start, end) => api.get(`/inventory/sales/range/?start=${start}&end=${end}`),
};

// ============================================================
// INVENTORY APIS
// ============================================================
export const inventoryAPI = {
  getAll: () => api.get('/inventory/inventory/'),
  getById: (id) => api.get(`/inventory/inventory/${id}/`),
  update: (id, data) => api.patch(`/inventory/inventory/${id}/`, data),
  getLowStock: () => api.get('/inventory/inventory/low_stock/'),
  getValuation: () => api.get('/inventory/inventory/valuation/'),
};

// ============================================================
// REPORT APIS
// ============================================================
export const reportAPI = {
  getSalesReport: (period = 'monthly') => api.get(`/reports/sales/?period=${period}`),
  getInventoryValuation: () => api.get('/reports/inventory-valuation/'),
  getDashboard: () => api.get('/reports/dashboard/'),
};

// ============================================================
// DASHBOARD APIS (Combined for efficiency)
// ============================================================
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [products, lowStock, sales] = await Promise.all([
        productAPI.getAll(),
        productAPI.getLowStock(),
        saleAPI.getToday(),
      ]);
      
      return {
        products: products.data,
        lowStock: lowStock.data,
        sales: sales.data,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      status: error.response.status,
      message: error.response.data?.detail || error.response.data?.message || 'An error occurred',
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 503,
      message: 'Cannot connect to server. Please check if backend is running.',
    };
  } else {
    // Something else happened
    return {
      status: 500,
      message: error.message || 'An unexpected error occurred',
    };
  }
};

export default api;