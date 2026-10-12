import api from './api';

export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const getMyReports = async () => {
  const response = await api.get('/reports/my');
  return response.data;
};
