import { api } from './api';

// Get my trips with pagination
export const getMyTrips = async (page = 1, perPage = 10) => {
  return await api.get(`/driver/trips?page=${page}&perPage=${perPage}`);
};

// Get single trip by ID
export const getMyTripById = async (id) => {
  return await api.get(`/driver/trips/${id}`);
};

// Start trip
export const startTrip = async (id, data) => {
  return await api.patch(`/driver/trips/${id}/start`, data);
};

// Finish trip
export const finishTrip = async (id, data) => {
  return await api.patch(`/driver/trips/${id}/finish`, data);
};

// Update trip notes
export const updateTripNotes = async (id, notes) => {
  return await api.patch(`/driver/trips/${id}/update-notes`, { notes });
};
