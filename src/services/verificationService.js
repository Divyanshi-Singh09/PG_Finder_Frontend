import api from './api';

/**
 * Owner Verification & Platform Trust API Service Layer
 */

export const uploadVerificationDocument = async (docType, fileData, fileName) => {
  try {
    const response = await api.post('/verification/owner/upload', { docType, fileData, fileName });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitOwnerVerification = async (fullName, phone) => {
  try {
    const response = await api.post('/verification/owner/submit', { fullName, phone });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOwnerVerificationStatus = async () => {
  try {
    const response = await api.get('/verification/owner/status');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { record: { verificationStatus: 'NOT_STARTED', documents: [] } } };
    }
    throw error;
  }
};

// Admin Moderation API Calls
export const getAdminOwnerVerifications = async (params = {}) => {
  try {
    const response = await api.get('/verification/admin/owner-verifications', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { records: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};

export const approveOwnerVerification = async (id) => {
  try {
    const response = await api.patch(`/verification/admin/owner-verifications/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectOwnerVerification = async (id, reason) => {
  try {
    const response = await api.patch(`/verification/admin/owner-verifications/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suspendPGListing = async (id, reason) => {
  try {
    const response = await api.patch(`/verification/admin/pgs/${id}/suspend`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unsuspendPGListing = async (id) => {
  try {
    const response = await api.patch(`/verification/admin/pgs/${id}/unsuspend`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User Report API Calls
export const createReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminReports = async (params = {}) => {
  try {
    const response = await api.get('/reports/admin/all', { params });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return { success: true, data: { reports: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } } };
    }
    throw error;
  }
};

export const updateReportStatus = async (id, data) => {
  try {
    const response = await api.patch(`/reports/admin/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
