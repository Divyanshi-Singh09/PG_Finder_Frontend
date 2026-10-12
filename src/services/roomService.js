import api from './api';

/**
 * Room & Bed Management API Service Layer
 */

export const createRoom = async (roomData) => {
  try {
    const response = await api.post('/rooms', roomData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRoomsByPG = async (pgId) => {
  try {
    const response = await api.get(`/rooms/pg/${pgId}`);
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { rooms: [] } };
    }
    throw error;
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await api.patch(`/rooms/${id}`, roomData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRoomBeds = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}/beds`);
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { beds: [] } };
    }
    throw error;
  }
};

export const updateBedStatus = async (bedId, status) => {
  try {
    const response = await api.patch(`/rooms/beds/${bedId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};
