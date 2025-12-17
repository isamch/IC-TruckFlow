import { api } from './api';

// Get my truck alerts
export const getMyTruckAlerts = async () => {
  return await api.get('/driver/my-truck-alerts');
};
