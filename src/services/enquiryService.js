import api from './api';

/**
 * PG Enquiry System API Service Layer
 */

export const createEnquiry = async (enquiryData) => {
  try {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyEnquiries = async () => {
  try {
    const response = await api.get('/enquiries/my');
    return response.data;
  } catch (error) {
    if (!error.response) return { success: true, data: { enquiries: [] } };
    throw error;
  }
};

export const getEnquiryById = async (id) => {
  try {
    const response = await api.get(`/enquiries/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const closeEnquiry = async (id) => {
  try {
    const response = await api.patch(`/enquiries/${id}/close`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOwnerEnquiries = async () => {
  try {
    const response = await api.get('/enquiries/owner/all');
    return response.data;
  } catch (error) {
    if (!error.response) return { success: true, data: { enquiries: [], stats: { total: 0 } } };
    throw error;
  }
};

export const respondToEnquiry = async (id, ownerReply) => {
  try {
    const response = await api.patch(`/enquiries/owner/${id}/respond`, { ownerReply });
    return response.data;
  } catch (error) {
    throw error;
  }
};
