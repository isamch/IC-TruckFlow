import { api } from './api';

// Get all trucks with pagination
export const getAllTrucks = async (page = 1, perPage = 5) => {
  return await api.get(`/admin/trucks?page=${page}&perPage=${perPage}`);
};

// Get single truck by ID
export const getTruckById = async (id) => {
  return await api.get(`/admin/trucks/${id}`);
};

// Create new truck
export const createTruck = async (truckData) => {
  return await api.post('/admin/trucks', truckData);
};

// Update truck
export const updateTruck = async (id, truckData) => {
  return await api.put(`/admin/trucks/${id}`, truckData);
};

// Delete truck
export const deleteTruck = async (id) => {
  return await api.delete(`/admin/trucks/${id}`);
};

// Update truck status
export const updateTruckStatus = async (id, status) => {
  return await api.patch(`/admin/trucks/${id}/status`, { status });
};

// Add tire to truck
export const addTireToTruck = async (id, tireData) => {
  return await api.patch(`/admin/trucks/${id}/add-tire`, tireData);
};

// Remove tire from truck
export const removeTireFromTruck = async (id, tireId) => {
  return await api.patch(`/admin/trucks/${id}/remove-tire`, { tireId });
};

// Get truck maintenance status
export const getTruckMaintenanceStatus = async (id) => {
  return await api.get(`/admin/trucks/${id}/maintenance-status`);
};
