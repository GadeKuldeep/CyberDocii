import api from './axios';

export const getJourney = (projectId, type = 'all') => api.get(`/journey/${projectId}?type=${type}`);
