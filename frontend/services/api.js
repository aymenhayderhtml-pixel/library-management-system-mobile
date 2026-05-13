import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Update this to your machine's IP when testing on a physical device
// For Android emulator use: http://10.0.2.2:5000/api
// For web/Expo Go on same network: http://YOUR_LOCAL_IP:5000/api
const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // no token
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Books ───────────────────────────────────────────
export const booksAPI = {
  getAll: (search = '') => api.get(`/books?search=${search}`),
  getOne: (id) => api.get(`/books/${id}`),
  add: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

// ─── Borrow ──────────────────────────────────────────
export const borrowAPI = {
  borrow: (bookId) => api.post('/borrow', { bookId }),
  return: (borrowId) => api.post('/borrow/return', { borrowId }),
  history: () => api.get('/borrow/history'),
};

// ─── Users ───────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
};

export default api;
