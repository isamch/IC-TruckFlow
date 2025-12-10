import Joi from 'joi';

// Create Trip Validation (Admin)
export const createTripValidation = Joi.object({
  driver: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid driver ID format',
      'any.required': 'Driver is required'
    }),

  truck: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid truck ID format',
      'any.required': 'Truck is required'
    }),

  trailer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid trailer ID format'
    }),

  startLocation: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Start location cannot be empty'
    }),

  endLocation: Joi.string()
    .optional()
    .messages({
      'string.empty': 'End location cannot be empty'
    }),

  plannedDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Planned date must be a valid date',
      'any.required': 'Planned date is required'
    }),

  status: Joi.string()
    .valid('to_do', 'in_progress', 'finished')
    .default('to_do')
    .messages({
      'any.only': 'Status must be to_do, in_progress, or finished'
    }),

  startKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Start km must be a number',
      'number.min': 'Start km cannot be negative'
    }),

  endKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'End km must be a number',
      'number.min': 'End km cannot be negative'
    }),

  fuelUsed: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Fuel used must be a number',
      'number.min': 'Fuel used cannot be negative'
    }),

  notes: Joi.string()
    .optional()
    .allow('')
});

// Update Trip Validation (Admin)
export const updateTripValidation = Joi.object({
  driver: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid driver ID format'
    }),

  truck: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid truck ID format'
    }),

  trailer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid trailer ID format'
    }),

  startLocation: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Start location cannot be empty'
    }),

  endLocation: Joi.string()
    .optional()
    .messages({
      'string.empty': 'End location cannot be empty'
    }),

  plannedDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Planned date must be a valid date'
    }),

  status: Joi.string()
    .valid('to_do', 'in_progress', 'finished')
    .optional()
    .messages({
      'any.only': 'Status must be to_do, in_progress, or finished'
    }),

  startKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Start km must be a number',
      'number.min': 'Start km cannot be negative'
    }),

  endKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'End km must be a number',
      'number.min': 'End km cannot be negative'
    }),

  fuelUsed: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Fuel used must be a number',
      'number.min': 'Fuel used cannot be negative'
    }),

  notes: Joi.string()
    .optional()
    .allow('')
});

// Start Trip Validation (Driver)
export const startTripValidation = Joi.object({
  startKm: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Start km must be a number',
      'number.min': 'Start km cannot be negative',
      'any.required': 'Start km is required'
    })
});

// Finish Trip Validation (Driver)
export const finishTripValidation = Joi.object({
  endKm: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'End km must be a number',
      'number.min': 'End km cannot be negative',
      'any.required': 'End km is required'
    }),

  fuelUsed: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Fuel used must be a number',
      'number.min': 'Fuel used cannot be negative'
    })
});

// Update Notes Validation (Driver)
export const updateNotesValidation = Joi.object({
  notes: Joi.string()
    .required()
    .allow('')
    .messages({
      'any.required': 'Notes is required'
    })
});

// ID Param Validation
export const tripIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid trip ID format',
      'any.required': 'Trip ID is required'
    })
});