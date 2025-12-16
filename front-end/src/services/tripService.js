import { api } from './api';

// Get all trips with pagination
export const getAllTrips = async (page = 1, perPage = 10) => {
  return await api.get(`/admin/trips?page=${page}&perPage=${perPage}`);
};

// Get single trip by ID
export const getTripById = async (id) => {
  return await api.get(`/admin/trips/${id}`);
};

// Create new trip
export const createTrip = async (tripData) => {
  return await api.post('/admin/trips', tripData);
};

// Update trip
export const updateTrip = async (id, tripData) => {
  return await api.put(`/admin/trips/${id}`, tripData);
};

// Delete trip
export const deleteTrip = async (id) => {
  return await api.delete(`/admin/trips/${id}`);
};

// Update trip status
export const updateTripStatus = async (id, status) => {
  return await api.patch(`/admin/trips/${id}/status`, { status });
};

// Start trip
export const startTrip = async (id, startKm) => {
  return await api.patch(`/admin/trips/${id}/start`, { startKm });
};

// Finish trip
export const finishTrip = async (id, tripData) => {
  return await api.patch(`/admin/trips/${id}/finish`, tripData);
};
