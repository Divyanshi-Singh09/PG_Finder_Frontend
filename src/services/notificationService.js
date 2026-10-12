import api from './api';

/**
 * Notifications API Service Layer
 */

export const getMyNotifications = async (params = {}) => {
  try {
    const response = await api.get('/notifications', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        data: {
          notifications: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
          unreadCount: 0,
        },
      };
    }
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    if (!error.response) return { success: true, data: { unreadCount: 0 } };
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Aliases for compatibility
export const getNotifications = getMyNotifications;
