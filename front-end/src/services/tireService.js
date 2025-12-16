import { api } from './api';

// Get all available tires (status: "available", not assigned to any truck)
export const getAvailableTires = async () => {
  const response = await api.get('/admin/tires?perPage=100');
  // Filter only available tires (status: "available" and truck: null)
  const availableTires = response.data?.tires?.filter(
    tire => tire.status === 'available' && tire.truck === null
  ) || [];
  return { ...response, data: availableTires };
};

// Get all tires
export const getAllTires = async (page = 1, perPage = 5) => {
  return await api.get(`/admin/tires?page=${page}&perPage=${perPage}`);
};

// Get single tire by ID
export const getTireById = async (id) => {
  return await api.get(`/admin/tires/${id}`);
};

// Create new tire
export const createTire = async (tireData) => {
  return await api.post('/admin/tires', tireData);
};

// Update tire
export const updateTire = async (id, tireData) => {
  return await api.put(`/admin/tires/${id}`, tireData);
};

// Delete tire
export const deleteTire = async (id) => {
  return await api.delete(`/admin/tires/${id}`);
};
