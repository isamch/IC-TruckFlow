import { api } from './api';

// Get all fuel logs with pagination
export const getAllFuelLogs = async (page = 1, perPage = 10) => {
  return await api.get(`/admin/fuel-logs?page=${page}&perPage=${perPage}`);
};

// Get single fuel log by ID
export const getFuelLogById = async (id) => {
  return await api.get(`/admin/fuel-logs/${id}`);
};

// Create new fuel log
export const createFuelLog = async (fuelLogData) => {
  return await api.post('/admin/fuel-logs', fuelLogData);
};

// Update fuel log
export const updateFuelLog = async (id, fuelLogData) => {
  return await api.put(`/admin/fuel-logs/${id}`, fuelLogData);
};

// Delete fuel log
export const deleteFuelLog = async (id) => {
  return await api.delete(`/admin/fuel-logs/${id}`);
};
