import Joi from 'joi';

// Create Maintenance Log Validation
export const createMaintenanceLogValidation = Joi.object({
  truck: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid truck ID format',
      'any.required': 'Truck is required'
    }),

  trip: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid trip ID format'
    }),

  type: Joi.string()
    .valid('oil', 'tires', 'engine', 'general')
    .required()
    .messages({
      'any.only': 'Type must be oil, tires, engine, or general',
      'any.required': 'Type is required'
    }),

  description: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Description cannot be empty'
    }),

  cost: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Cost must be a number',
      'number.min': 'Cost cannot be negative'
    }),

  date: Joi.date()
    .optional()
    .messages({
      'date.base': 'Date must be a valid date'
    })
});

// Update Maintenance Log Validation
export const updateMaintenanceLogValidation = Joi.object({
  truck: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid truck ID format'
    }),

  trip: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid trip ID format'
    }),

  type: Joi.string()
    .valid('oil', 'tires', 'engine', 'general')
    .optional()
    .messages({
      'any.only': 'Type must be oil, tires, engine, or general'
    }),

  description: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Description cannot be empty'
    }),

  cost: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Cost must be a number',
      'number.min': 'Cost cannot be negative'
    }),

  date: Joi.date()
    .optional()
    .messages({
      'date.base': 'Date must be a valid date'
    })
});

// ID Param Validation
export const maintenanceLogIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid maintenance log ID format',
      'any.required': 'Maintenance log ID is required'
    })
});