import axios from 'axios';
import { emit } from './notifier';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const mutMethods = ['post', 'put', 'patch', 'delete'];

httpClient.interceptors.response.use(
  response => {
    const body = response.data;
    if (body && body.success === false) {
      return Promise.reject(new Error(body.errors?.[0] || body.message || 'Request failed'));
    }
    const method = response.config?.method;
    if (mutMethods.includes(method) && body?.message) {
      emit('success', body.message);
    }
    return body;
  },
  async error => {
    const originalRequest = error.config;

    console.error(`[Network Error] ${error.response?.status || 'No response'} ${originalRequest?.method?.toUpperCase() || '?'} ${originalRequest?.url || '?'}`, error.response?.data || error.message);

    const isAuthUrl = originalRequest.url?.includes('/auth/');
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return httpClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('dukadesk_refresh_token');
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        localStorage.setItem('dukadesk_token', accessToken);
        localStorage.setItem('dukadesk_refresh_token', newRefreshToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const body = error.response?.data;
    if (body && body.errors?.length) {
      if (!isAuthUrl) emit('error', body.errors[0]);
      return Promise.reject(new Error(body.errors[0]));
    }
    const msg = body?.message || error.message || 'Network request failed';
    if (!isAuthUrl) emit('error', msg);
    return Promise.reject(error);
  }
);

export default httpClient;
