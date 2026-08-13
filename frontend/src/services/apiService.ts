import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/auth.slice';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfTokenInMemory = '';

export const setCsrfToken = (token: string) => {
  csrfTokenInMemory = token;
};

export const clearCsrfToken = () => {
  csrfTokenInMemory = '';
};

// Request interceptor to automatically attach x-csrf-token header on mutating requests
api.interceptors.request.use((config) => {
  const isMutatingMethod = ['post', 'put', 'patch', 'delete'].includes(
    config.method?.toLowerCase() || ''
  );

  if (isMutatingMethod && csrfTokenInMemory) {
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('x-csrf-token', csrfTokenInMemory);
    } else {
      config.headers = config.headers || {};
      config.headers['x-csrf-token'] = csrfTokenInMemory;
    }
  }

  return config;
});

// Mutex & Queue variables to handle concurrent 401 token refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for automatic token refresh on HTTP 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh access token using HTTP-Only refresh cookie
        await api.post('/auth/refresh');
        processQueue(null);
        // Retry original request with newly issued cookie
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Clear auth state and redirect to login if refresh fails
        clearCsrfToken();
        store.dispatch(logout());
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
