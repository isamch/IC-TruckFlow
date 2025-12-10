import Joi from 'joi';

// Create Trailer Validation
export const createTrailerValidation = Joi.object({
  serialNumber: Joi.string()
    .required()
    .messages({
      'any.required': 'Serial number is required',
      'string.empty': 'Serial number cannot be empty'
    }),

  type: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Type cannot be empty'
    }),

  maxLoadKg: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Max load must be a number',
      'number.min': 'Max load cannot be negative'
    }),

  status: Joi.string()
    .valid('available', 'on_trip', 'maintenance')
    .default('available')
    .messages({
      'any.only': 'Status must be available, on_trip, or maintenance'
    }),

  lastCheckDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Last check date must be a valid date'
    })
});

// Update Trailer Validation
export const updateTrailerValidation = Joi.object({
  serialNumber: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Serial number cannot be empty'
    }),

  type: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Type cannot be empty'
    }),

  maxLoadKg: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Max load must be a number',
      'number.min': 'Max load cannot be negative'
    }),

  status: Joi.string()
    .valid('available', 'on_trip', 'maintenance')
    .optional()
    .messages({
      'any.only': 'Status must be available, on_trip, or maintenance'
    }),

  lastCheckDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Last check date must be a valid date'
    })
});

// Update Trailer Status Validation
export const updateTrailerStatusValidation = Joi.object({
  status: Joi.string()
    .valid('available', 'on_trip', 'maintenance')
    .required()
    .messages({
      'any.only': 'Status must be available, on_trip, or maintenance',
      'any.required': 'Status is required'
    })
});

// ID Param Validation
export const trailerIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid trailer ID format',
      'any.required': 'Trailer ID is required'
    })
});