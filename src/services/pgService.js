import api from './api';

/**
 * PG Management & Search API Service Layer
 */

export const searchPGs = async (params = {}) => {
  try {
    const response = await api.get('/pgs/search', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          pgs: [],
          pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
        },
      };
    }
    throw error;
  }
};

export const getPGAutocomplete = async (searchQuery) => {
  try {
    const response = await api.get('/pgs/autocomplete', { params: { q: searchQuery } });
    return response.data;
  } catch (error) {
    return { success: true, data: { suggestions: [] } };
  }
};

export const saveSearch = async (name, filters) => {
  try {
    const response = await api.post('/pgs/saved-searches', { name, filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSavedSearches = async () => {
  try {
    const response = await api.get('/pgs/saved-searches');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { savedSearches: [] } };
    }
    throw error;
  }
};

export const deleteSavedSearch = async (id) => {
  try {
    const response = await api.delete(`/pgs/saved-searches/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPublicPGById = async (id) => {
  try {
    const response = await api.get(`/pgs/public/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPG = async (pgData) => {
  try {
    const response = await api.post('/pgs', pgData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyPGs = async () => {
  try {
    const response = await api.get('/pgs/my');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { pgs: [] } };
    }
    throw error;
  }
};

export const getPGById = async (id) => {
  try {
    const response = await api.get(`/pgs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePG = async (id, pgData) => {
  try {
    const response = await api.put(`/pgs/${id}`, pgData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePG = async (id) => {
  try {
    const response = await api.delete(`/pgs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitPG = async (id) => {
  try {
    const response = await api.patch(`/pgs/${id}/submit`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
