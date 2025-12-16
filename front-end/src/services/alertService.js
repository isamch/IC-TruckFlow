import { api } from './api';

// Get all maintenance alerts (no pagination from backend)
export const getAllAlerts = async () => {
  return await api.get('/admin/maintenance-alerts');
};
