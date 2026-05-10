import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Access denied:', data.error);
      }

      if (status === 404) {
        // Not found
        console.error('Resource not found:', data.error);
      }

      if (status === 400) {
        // Bad request - validation error
        console.error('Validation error:', data.details || data.error);
      }

      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server:', error.request);
      return Promise.reject(new Error('Network error - no response from server'));
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
