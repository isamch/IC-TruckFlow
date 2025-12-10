import Joi from 'joi';

// Create Fuel Log Validation
export const createFuelLogValidation = Joi.object({
  trip: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid trip ID format',
      'any.required': 'Trip is required'
    }),

  liters: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Liters must be a number',
      'number.min': 'Liters cannot be negative',
      'any.required': 'Liters is required'
    }),

  pricePerLiter: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Price per liter must be a number',
      'number.min': 'Price per liter cannot be negative'
    }),

  stationName: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Station name cannot be empty'
    }),

  timestamp: Joi.date()
    .optional()
    .messages({
      'date.base': 'Timestamp must be a valid date'
    })
});

// Update Fuel Log Validation
export const updateFuelLogValidation = Joi.object({
  trip: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid trip ID format'
    }),

  liters: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Liters must be a number',
      'number.min': 'Liters cannot be negative'
    }),

  pricePerLiter: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Price per liter must be a number',
      'number.min': 'Price per liter cannot be negative'
    }),

  stationName: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Station name cannot be empty'
    }),

  timestamp: Joi.date()
    .optional()
    .messages({
      'date.base': 'Timestamp must be a valid date'
    })
});

// ID Param Validation
export const fuelLogIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid fuel log ID format',
      'any.required': 'Fuel log ID is required'
    })
});