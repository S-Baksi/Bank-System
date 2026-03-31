import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refresh: (refreshToken) => api.post(`/auth/refresh?refreshToken=${refreshToken}`),
};

// ── Accounts ──
export const accountApi = {
  getAll: () => api.get('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  getBalance: (id) => api.get(`/accounts/${id}/balance`),
  create: (data) => api.post('/accounts', data),
};

// ── Transactions ──
export const transactionApi = {
  transfer: (data) => api.post('/transactions/transfer', data),
  deposit: (data) => api.post('/transactions/deposit', data),
  withdrawal: (data) => api.post('/transactions/withdrawal', data),
  getHistory: (accountId) => api.get(`/transactions/account/${accountId}`),
};

// ── Audit ──
export const auditApi = {
  getLogs: (page = 0, size = 50) => api.get(`/audit/logs?page=${page}&size=${size}`),
  getFailedActions: (page = 0, size = 50) => api.get(`/audit/failed-actions?page=${page}&size=${size}`),
};

export default api;
