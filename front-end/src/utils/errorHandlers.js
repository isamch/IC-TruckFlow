import { toast } from 'react-toastify';

/**
 * Handle API errors and return formatted error object
 * @param {Error} error - Error object from API
 * @returns {Object} - Formatted error object with field errors
 */
export const handleApiError = (error) => {
  // Default error response
  const errorResponse = {
    message: error.message || 'An error occurred',
    fieldErrors: {},
    showToast: true,
  };

  // If error has validation details array (from Joi)
  if (error.details && Array.isArray(error.details)) {
    // Convert details array to field errors object
    error.details.forEach((detail) => {
      // Extract field name from "body.password" -> "password"
      const fieldName = detail.field.split('.').pop();
      errorResponse.fieldErrors[fieldName] = detail.message;
    });

    errorResponse.showToast = false; // Don't show toast for validation errors
    errorResponse.message = 'Please fix the errors below';
  }

  // If error has errors object (alternative format)
  else if (error.errors && typeof error.errors === 'object') {
    // Convert backend errors to field errors
    errorResponse.fieldErrors = error.errors;
    errorResponse.showToast = false;
    errorResponse.message = 'Please fix the errors below';
  }

  // If it's a general error (like "Invalid credentials")
  else if (error.statusCode === 401) {
    errorResponse.message = error.message;
    errorResponse.showToast = true;
  }

  // Network error
  else if (error.statusCode === 0) {
    errorResponse.message = 'Network error. Please check your connection.';
    errorResponse.showToast = true;
  }

  // Server error
  else if (error.statusCode >= 500) {
    errorResponse.message = 'Server error. Please try again later.';
    errorResponse.showToast = true;
  }

  return errorResponse;
};

/**
 * Display error toast
 * @param {string} message - Error message
 */
export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Display success toast
 * @param {string} message - Success message
 */
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Clear field errors when user starts typing
 * @param {string} fieldName - Field name
 * @param {Object} errors - Current errors object
 * @param {Function} setErrors - Set errors function
 */
export const clearFieldError = (fieldName, errors, setErrors) => {
  if (errors[fieldName]) {
    const newErrors = { ...errors };
    delete newErrors[fieldName];
    setErrors(newErrors);
  }
};
