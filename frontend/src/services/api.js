import axios from 'axios';

// API Configuration
// In production, use relative URLs since backend serves the frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api'
);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login or refresh page
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Profile API calls
export const profileAPI = {
  getProfile: (userId) => api.get(`/profile/${userId}`),
  updateProfile: (userId, profileData) => api.put(`/profile/${userId}`, profileData),
};

// Crop API calls
export const cropAPI = {
  registerCrop: (cropData) => api.post('/crop/reg-batch', cropData),
  getCrops: () => api.get('/crop/list'),
  getCropById: (cropId) => api.get(`/crop/${cropId}`),
  updateCrop: (cropId, cropData) => api.put(`/crop/${cropId}`, cropData),
  deleteCrop: (cropId) => api.delete(`/crop/${cropId}`),
  getCropCount: () => api.get('/crop/count'),
  getAllCrops: () => api.get('/crop/list'),
};

// Weather API calls
export const weatherAPI = {
  getWeather: () => api.get('/weather/forecast'),
  getWeatherAdvisory: () => api.get('/weather/advisory'),
  getDistricts: () => api.get('/weather/districts'),
  updateLocation: (district) => api.put('/weather/location', { district }),
};

// Prediction API calls
export const predictionAPI = {
  getCropPrediction: (cropId) => api.get(`/prediction/crop/${cropId}`),
  getAllPredictions: () => api.get('/prediction/all'),
  getCropAnalytics: (cropId, days = 7) => api.get(`/prediction/analytics/${cropId}?days=${days}`),
  getCacheStats: () => api.get('/prediction/cache/stats'),
  clearCache: () => api.post('/prediction/cache/clear'),
};

// Export/Sync API calls
export const exportAPI = {
  exportData: (format = 'csv') => api.get(`/export?format=${format}`, {
    responseType: 'blob', // Important for file downloads
  }),
};

export const syncAPI = {
  syncData: () => api.post('/sync'),
  getSyncStatus: () => api.get('/sync/status'),
  syncOfflineData: (data) => api.post('/sync/offline', data),
};

// Language API calls
export const langAPI = {
  getTranslations: (lang = 'en') => api.get(`/lang/${lang}`),
};

// Districts API calls
export const districtsAPI = {
  searchDistricts: (query) => api.get(`/districts/search?query=${encodeURIComponent(query)}`),
  getAllDistricts: () => api.get('/districts/all'),
};

// Utility function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      message: data?.message || `Server error: ${status}`,
      status,
      data: data || null,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null,
    };
  }
};

// Utility function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Utility function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Default export
export default api;