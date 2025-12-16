import { api } from './api';

// Get all trailers with pagination
export const getAllTrailers = async (page = 1, perPage = 10) => {
  return await api.get(`/admin/trailers?page=${page}&perPage=${perPage}`);
};

// Get single trailer by ID
export const getTrailerById = async (id) => {
  return await api.get(`/admin/trailers/${id}`);
};

// Create new trailer
export const createTrailer = async (trailerData) => {
  return await api.post('/admin/trailers', trailerData);
};

// Update trailer
export const updateTrailer = async (id, trailerData) => {
  return await api.put(`/admin/trailers/${id}`, trailerData);
};

// Delete trailer
export const deleteTrailer = async (id) => {
  return await api.delete(`/admin/trailers/${id}`);
};

// Update trailer status
export const updateTrailerStatus = async (id, status) => {
  return await api.patch(`/admin/trailers/${id}/status`, { status });
};
