import api from './axios';

export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getUsers = () => api.get('/auth/users');
