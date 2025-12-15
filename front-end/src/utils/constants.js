// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// App name
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'IC-TruckFlow';

// Environment
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Truck statuses
export const TRUCK_STATUS = {
  AVAILABLE: 'available',
  ON_TRIP: 'on_trip',
  MAINTENANCE: 'maintenance',
};

// Trip statuses
export const TRIP_STATUS = {
  TO_DO: 'to_do',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
};

// Maintenance types
export const MAINTENANCE_TYPES = {
  OIL: 'oil',
  TIRES: 'tires',
  ENGINE: 'engine',
  GENERAL: 'general',
};

// Tire conditions
export const TIRE_CONDITION = {
  GOOD: 'good',
  WORN: 'worn',
  CRITICAL: 'critical',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
};

// Status labels (for display)
export const STATUS_LABELS = {
  // Truck statuses
  truck_status: {
    available: 'Available',
    on_trip: 'On Trip',
    maintenance: 'Maintenance',
  },

  // Trip statuses
  trip_status: {
    to_do: 'Pending',
    in_progress: 'In Progress',
    finished: 'Completed',
  },

  // Maintenance types
  maintenance_types: {
    oil: 'Oil Change',
    tires: 'Tires',
    engine: 'Engine',
    general: 'General Maintenance',
  },

  // Tire conditions
  tire_condition: {
    good: 'Good',
    worn: 'Worn',
    critical: 'Critical',
  },

  // User roles
  user_roles: {
    admin: 'System Admin',
    driver: 'Driver',
  },
};
