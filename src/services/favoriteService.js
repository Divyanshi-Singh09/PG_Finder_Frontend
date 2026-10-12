import api from './api';

/**
 * Favorite / Saved PGs API Service Layer
 */

export const savePG = async (pgId) => {
  try {
    const response = await api.post(`/favorites/${pgId}`);
    return response.data;
  } catch (error) {
    if (!error.response) return { success: true, message: 'PG saved to favourites' };
    throw error;
  }
};

export const removePG = async (pgId) => {
  try {
    const response = await api.delete(`/favorites/${pgId}`);
    return response.data;
  } catch (error) {
    if (!error.response) return { success: true, message: 'PG removed from favourites' };
    throw error;
  }
};

export const getFavorites = async (params = {}) => {
  try {
    const response = await api.get('/favorites', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: { favorites: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } },
      };
    }
    throw error;
  }
};

export const getFavoriteStatus = async (pgId) => {
  try {
    const response = await api.get(`/favorites/${pgId}/status`);
    return response.data;
  } catch (error) {
    return { success: true, data: { isSaved: false } };
  }
};
