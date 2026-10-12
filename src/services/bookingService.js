import api from './api';

/**
 * Room Booking Request System API Service Layer (NO PAYMENT)
 */

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyBookings = async (params = {}) => {
  try {
    const response = await api.get('/bookings/my', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { bookings: [] } };
    }
    throw error;
  }
};

export const getOwnerBookings = async (params = {}) => {
  try {
    const response = await api.get('/bookings/owner', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { bookings: [] } };
    }
    throw error;
  }
};

export const getOwnerOccupancy = async () => {
  try {
    const response = await api.get('/bookings/owner/occupancy');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { totalBeds: 0, available: 0, reserved: 0, occupied: 0, maintenance: 0 } };
    }
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptBooking = async (id) => {
  try {
    const response = await api.patch(`/bookings/${id}/accept`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectBooking = async (id, ownerResponse = '') => {
  try {
    const response = await api.patch(`/bookings/${id}/reject`, { ownerResponse });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (id, cancellationReason = '') => {
  try {
    const response = await api.patch(`/bookings/${id}/cancel`, { cancellationReason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminBookings = async (params = {}) => {
  try {
    const response = await api.get('/bookings/admin/all', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { bookings: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};
