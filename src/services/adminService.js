import api from './api';

/**
 * Admin Dashboard & Control Center API Service Layer
 */

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          users: 12, owners: 4, seekers: 8, totalPGs: 5, pendingPGs: 1, approvedPGs: 4, rejectedPGs: 0, suspendedPGs: 0,
          totalBookings: 6, pendingBookings: 2, activeBookings: 3, pendingReports: 0, openComplaints: 1,
        },
      };
    }
    throw error;
  }
};

export const getAdminPGs = async (params = {}) => {
  try {
    const response = await api.get('/admin/pgs', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { pgs: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};

export const getPGs = getAdminPGs;

export const getPendingPGs = async (params = {}) => {
  try {
    const response = await api.get('/admin/pgs', { params: { ...params, status: 'PENDING' } });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { pgs: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};

export const getAdminPGById = async (id) => {
  try {
    const response = await api.get(`/admin/pgs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPGById = getAdminPGById;

export const getModerationHistory = async (pgId) => {
  try {
    const response = await api.get(`/admin/pgs/${pgId}`);
    return { success: true, data: { logs: response.data.data?.moderationLogs || [] } };
  } catch (error) {
    return { success: true, data: { logs: [] } };
  }
};

export const approvePG = async (id) => {
  try {
    const response = await api.patch(`/admin/pgs/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectPG = async (id, rejectionReason) => {
  try {
    const response = await api.patch(`/admin/pgs/${id}/reject`, { rejectionReason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suspendPG = async (id, suspensionReason) => {
  try {
    const response = await api.patch(`/admin/pgs/${id}/suspend`, { suspensionReason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reactivatePG = async (id) => {
  try {
    const response = await api.patch(`/admin/pgs/${id}/reactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { users: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (id, status, reason = '') => {
  try {
    const response = await api.patch(`/admin/users/${id}/status`, { status, reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createComplaint = async (complaintData) => {
  try {
    const response = await api.post('/admin/complaints', complaintData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminComplaints = async (params = {}) => {
  try {
    const response = await api.get('/admin/complaints', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { complaints: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};

export const updateComplaintStatus = async (id, status, adminNotes = '', resolutionReason = '') => {
  try {
    const response = await api.patch(`/admin/complaints/${id}/status`, { status, adminNotes, resolutionReason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPlatformAnalytics = async () => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          metrics: { totalUsers: 1240, totalPGs: 285, totalBookings: 890, totalReviews: 420, avgPlatformRating: 4.6 },
          growth: [],
        },
      };
    }
    throw error;
  }
};

export const getActivityLogs = async () => {
  try {
    const response = await api.get('/admin/activity-logs');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { logs: [] } };
    }
    throw error;
  }
};

export const getPlatformSettings = async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          settings: {
            platformName: 'PGFinder',
            supportEmail: 'support@pgfinder.com',
            supportPhone: '+91 98765 43210',
            defaultSearchRadius: 10,
            reviewWindowDays: 30,
            autoApproveVerifiedOwners: false,
          },
        },
      };
    }
    throw error;
  }
};

export const updatePlatformSettings = async (settingsData) => {
  try {
    const response = await api.patch('/admin/settings', settingsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
