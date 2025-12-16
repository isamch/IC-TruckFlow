import { api } from './api';

// Get all maintenance logs with pagination
export const getAllMaintenanceLogs = async (page = 1, perPage = 10) => {
  return await api.get(`/admin/maintenance-logs?page=${page}&perPage=${perPage}`);
};

// Get single maintenance log by ID
export const getMaintenanceLogById = async (id) => {
  return await api.get(`/admin/maintenance-logs/${id}`);
};

// Create new maintenance log
export const createMaintenanceLog = async (maintenanceData) => {
  return await api.post('/admin/maintenance-logs', maintenanceData);
};

// Update maintenance log
export const updateMaintenanceLog = async (id, maintenanceData) => {
  return await api.put(`/admin/maintenance-logs/${id}`, maintenanceData);
};

// Delete maintenance log
export const deleteMaintenanceLog = async (id) => {
  return await api.delete(`/admin/maintenance-logs/${id}`);
};
