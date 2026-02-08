import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')
    ? 'https://cyberdocii.onrender.com/api'
    : 'http://localhost:5000/api');

const BASE_URL = API_URL.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_URL,
});

export { BASE_URL };

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('cyberdocii_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
