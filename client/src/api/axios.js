import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/signup');

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        const reason =
          error.response?.data?.message === 'Invalid or expired token'
            ? 'expired'
            : 'required';
        window.location.assign(`/login?session=${reason}`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
