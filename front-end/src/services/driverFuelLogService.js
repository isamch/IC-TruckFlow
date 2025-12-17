import { api } from './api';

// Get my fuel logs with pagination
export const getMyFuelLogs = async (page = 1, perPage = 10) => {
  return await api.get(`/driver/fuel-logs?page=${page}&perPage=${perPage}`);
};

// Get single fuel log by ID
export const getMyFuelLogById = async (id) => {
  return await api.get(`/driver/fuel-logs/${id}`);
};

// Add fuel log
export const addFuelLog = async (fuelLogData) => {
  return await api.post('/driver/fuel-logs', fuelLogData);
};
