import api from './api';

/**
 * Visit Scheduling & Availability Service Layer
 */

export const getPublicPGAvailability = async (pgId) => {
  try {
    const response = await api.get(`/pgs/${pgId}/availability`);
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { slots: [] } };
    }
    throw error;
  }
};

export const createAvailabilitySlot = async (data) => {
  try {
    const response = await api.post('/availability', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyAvailability = async () => {
  try {
    const response = await api.get('/availability/my');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { slots: [] } };
    }
    throw error;
  }
};

export const updateAvailabilitySlot = async (id, data) => {
  try {
    const response = await api.patch(`/availability/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAvailabilitySlot = async (id) => {
  try {
    const response = await api.delete(`/availability/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Seeker & Owner Visit API Calls
export const requestVisit = async (visitData) => {
  try {
    const response = await api.post('/visits', visitData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyVisits = async () => {
  try {
    const response = await api.get('/visits/my');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { visits: [] } };
    }
    throw error;
  }
};

export const getOwnerVisits = async () => {
  try {
    const response = await api.get('/visits/owner/all');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { visits: [] } };
    }
    throw error;
  }
};

export const getVisitById = async (id) => {
  try {
    const response = await api.get(`/visits/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmVisit = async (id) => {
  try {
    const response = await api.patch(`/visits/${id}/confirm`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectVisit = async (id, ownerNote = '') => {
  try {
    const response = await api.patch(`/visits/${id}/reject`, { ownerNote });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelVisit = async (id, cancellationReason = '') => {
  try {
    const response = await api.patch(`/visits/${id}/cancel`, { cancellationReason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVisitStatus = async (id, status) => {
  try {
    const response = await api.patch(`/visits/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminVisits = async (params = {}) => {
  try {
    const response = await api.get('/visits/admin/all', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { visits: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};
