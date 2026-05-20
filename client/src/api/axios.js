import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const CSRF_STORAGE_KEY = 'shortly-csrf';

const getCsrfToken = () => {
  try {
    return localStorage.getItem(CSRF_STORAGE_KEY);
  } catch {
    return null;
  }
};

const setCsrfToken = (token) => {
  try {
    if (!token) return;
    localStorage.setItem(CSRF_STORAGE_KEY, token);
  } catch {
    // ignore
  }
};

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  const isSafe = method === 'get' || method === 'head' || method === 'options';
  if (!isSafe) {
    const token = getCsrfToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['x-csrf-token'] = token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/signup') ||
      error.config?.url?.includes('/auth/me') ||
      error.config?.url?.includes('/auth/csrf');

    if (error.response?.status === 401 && !isAuthRequest) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        const reason =
          error.response?.data?.message === 'Invalid or expired token'
            ? 'expired'
            : 'required';
        const redirect = encodeURIComponent(path + window.location.search);
        window.location.assign(`/login?session=${reason}&redirect=${redirect}`);
      }
    }
    return Promise.reject(error);
  }
);

const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  } catch {
    // ignore
  }
  return null;
};

export const ensureCsrfToken = async () => {
  const existing = getCsrfToken();
  const cookieVal = getCookie('csrfToken');
  
  if (existing && cookieVal === existing) {
    return existing;
  }
  
  const res = await api.get('/auth/csrf');
  const token = res.data?.data?.csrfToken;
  if (token) setCsrfToken(token);
  return token;
};

export default api;
