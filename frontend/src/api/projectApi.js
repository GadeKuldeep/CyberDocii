import api from './axios';

export const getProjects = (userId) => api.get(`/projects${userId ? `?userId=${userId}` : ''}`);
export const createProject = (data) => api.post('/projects', data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const getProjectById = (id) => api.get(`/projects/${id}`);
