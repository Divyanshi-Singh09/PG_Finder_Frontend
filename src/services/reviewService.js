import api from './api';

/**
 * Reviews, Ratings & Trust System API Service Layer
 */

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPGReviews = async (pgId, params = {}) => {
  try {
    const response = await api.get(`/reviews/pg/${pgId}`, { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          reviews: [],
          summary: { average: 0, count: 0, distribution: { five: 0, four: 0, three: 0, two: 0, one: 0 } },
          pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        },
      };
    }
    throw error;
  }
};

export const getReviewEligibility = async (bookingId) => {
  try {
    const response = await api.get(`/reviews/eligibility/${bookingId}`);
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { eligible: false } };
    }
    throw error;
  }
};

export const toggleHelpful = async (reviewId) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const replyToReview = async (reviewId, responseText) => {
  try {
    const response = await api.patch(`/reviews/${reviewId}/reply`, { response: responseText });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOwnerReviews = async () => {
  try {
    const response = await api.get('/reviews/owner');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { reviews: [] } };
    }
    throw error;
  }
};

export const getAdminReviews = async (params = {}) => {
  try {
    const response = await api.get('/reviews/admin/all', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { reviews: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};

export const moderateReviewStatus = async (reviewId, status, moderationReason = '') => {
  try {
    const response = await api.patch(`/reviews/admin/${reviewId}/status`, { status, moderationReason });
    return response.data;
  } catch (error) {
    throw error;
  }
};
