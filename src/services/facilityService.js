import api from './api';

export const getFacilities = async () => {
  const response = await api.get('/facilities');
  return response.data;
};

export const createFacility = async (data) => {
  const response = await api.post('/facilities', data);
  return response.data;
};

export const updateFacilityStatus = async (id, data) => {
  const response = await api.patch(`/facilities/${id}`, data);
  return response.data;
};
