import api from './api';

/**
 * Dashboard Intelligence API Service Layer
 */

export const getSeekerDashboard = async () => {
  try {
    const response = await api.get('/dashboard/seeker');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: { savedPGs: 0, activeEnquiries: 0, responses: 0, reviews: 0, recentActivity: [] },
      };
    }
    throw error;
  }
};

export const getOwnerDashboard = async () => {
  try {
    const response = await api.get('/dashboard/owner');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          totalPGs: 0,
          approvedPGs: 0,
          pendingPGs: 0,
          totalEnquiries: 0,
          unreadEnquiries: 0,
          averageRating: 0,
          totalReviews: 0,
          recentActivity: [],
        },
      };
    }
    throw error;
  }
};

export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/dashboard/admin');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          totalUsers: 0,
          seekers: 0,
          owners: 0,
          totalPGs: 0,
          pendingPGs: 0,
          approvedPGs: 0,
          pendingReviews: 0,
          totalEnquiries: 0,
        },
      };
    }
    throw error;
  }
};
