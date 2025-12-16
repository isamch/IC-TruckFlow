import { api } from './api';

// Get all users with pagination
export const getAllUsers = async (page = 1, perPage = 10) => {
  return await api.get(`/admin/users?page=${page}&perPage=${perPage}`);
};

// Get single user by ID
export const getUserById = async (id) => {
  return await api.get(`/admin/users/${id}`);
};

// Create new user
export const createUser = async (userData) => {
  return await api.post('/admin/users', userData);
};

// Update user
export const updateUser = async (id, userData) => {
  return await api.put(`/admin/users/${id}`, userData);
};

// Delete user
export const deleteUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};

// Toggle user active status
export const toggleUserStatus = async (id) => {
  return await api.patch(`/admin/users/${id}/toggle-status`);
};
