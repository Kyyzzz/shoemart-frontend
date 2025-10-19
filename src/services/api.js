import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product API calls
export const productAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/products?${params}`);
  },
  
  getFeatured: () => api.get('/products/featured'),
  
  getById: (id) => api.get(`/products/${id}`),
  
  create: (data) => api.post('/products', data),
  
  update: (id, data) => api.put(`/products/${id}`, data),
  
  delete: (id) => api.delete(`/products/${id}`),
};

export default api;