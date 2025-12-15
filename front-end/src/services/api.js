// Backend API URL from .env file
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Function to send requests to the API
const fetchAPI = async (endpoint, options = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem('accessToken');

  // Setup headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Setup request config
  const config = {
    ...options,
    headers,
  };

  try {
    // Send request
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Parse response
    const data = await response.json();

    // Check response
    if (!response.ok) {
      // If 401 error (Unauthorized)
      if (response.status === 401) {
        // Only redirect if NOT on login page and NOT a login request
        const isLoginRequest = endpoint.includes('/auth/login');
        const isOnLoginPage = window.location.pathname === '/login';

        if (!isLoginRequest && !isOnLoginPage) {
          // User's session expired, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        // If on login page or login request, just throw error (don't redirect)
      }

      // Create error object with all backend data
      const error = new Error(data.message || 'An error occurred');
      error.statusCode = response.status;
      error.code = data.code;
      error.errors = data.errors; // Validation errors from Joi
      error.details = data.details;

      throw error;
    }

    // Return data
    return data;
  } catch (error) {
    // If it's a network error (not from backend)
    if (!error.statusCode) {
      const networkError = new Error('Network error. Please check your connection.');
      networkError.statusCode = 0;
      throw networkError;
    }

    throw error;
  }
};

// Helper functions for each request type
export const api = {
  // GET - fetch data
  get: (endpoint) => {
    return fetchAPI(endpoint, {
      method: 'GET',
    });
  },

  // POST - create new data
  post: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT - full update
  put: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // PATCH - partial update
  patch: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE - delete
  delete: (endpoint) => {
    return fetchAPI(endpoint, {
      method: 'DELETE',
    });
  },
};

export default api;
