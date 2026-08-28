import axios from 'axios';

const defaultApiUrl = process.env.NODE_ENV === 'production'
  ? 'https://college-complaint-system-bqhb.onrender.com/api'
  : 'http://localhost:5000/api';

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || defaultApiUrl });
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('edufix-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
