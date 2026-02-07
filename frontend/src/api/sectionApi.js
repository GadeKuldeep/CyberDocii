import api from './axios';

export const getSections = (projectId) => api.get(`/sections/${projectId}`);
export const createSection = (data) => api.post('/sections', data);
export const updateSection = (id, data) => api.put(`/sections/${id}`, data);
export const deleteSection = (id) => api.delete(`/sections/${id}`);
export const reorderSections = (projectId, updates) => api.put('/sections/reorder', { projectId, updates });
export const uploadFile = (formData) => api.post('/sections/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
