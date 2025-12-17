import { api } from './api';

// Get my maintenance logs with pagination
export const getMyMaintenanceLogs = async (page = 1, perPage = 10) => {
  return await api.get(`/driver/maintenance-logs?page=${page}&perPage=${perPage}`);
};

// Get single maintenance log by ID
export const getMyMaintenanceLogById = async (id) => {
  return await api.get(`/driver/maintenance-logs/${id}`);
};

// Add maintenance log
export const addMaintenanceLog = async (maintenanceData) => {
  return await api.post('/driver/maintenance-logs', maintenanceData);
};

// Update maintenance log
export const updateMaintenanceLog = async (id, maintenanceData) => {
  return await api.put(`/driver/maintenance-logs/${id}`, maintenanceData);
};

// Delete maintenance log
export const deleteMaintenanceLog = async (id) => {
  return await api.delete(`/driver/maintenance-logs/${id}`);
};
