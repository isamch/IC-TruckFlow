import Joi from 'joi';

// Create Tire Validation
export const createTireValidation = Joi.object({
  position: Joi.string()
    .required()
    .messages({
      'any.required': 'Position is required',
      'string.empty': 'Position cannot be empty'
    }),

  installKm: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Install km must be a number',
      'number.min': 'Install km cannot be negative',
      'any.required': 'Install km is required'
    }),

  currentKm: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Current km must be a number',
      'number.min': 'Current km cannot be negative'
    }),

  condition: Joi.string()
    .valid('good', 'worn', 'critical')
    .default('good')
    .messages({
      'any.only': 'Condition must be good, worn, or critical'
    }),

  truck: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid truck ID format'
    })
});

// Update Tire Validation
export const updateTireValidation = Joi.object({
  position: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Position cannot be empty'
    }),

  installKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Install km must be a number',
      'number.min': 'Install km cannot be negative'
    }),

  currentKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Current km must be a number',
      'number.min': 'Current km cannot be negative'
    }),

  condition: Joi.string()
    .valid('good', 'worn', 'critical')
    .optional()
    .messages({
      'any.only': 'Condition must be good, worn, or critical'
    }),

  truck: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid truck ID format'
    })
});

// Change Position Validation
export const changePositionValidation = Joi.object({
  position: Joi.string()
    .required()
    .messages({
      'any.required': 'Position is required',
      'string.empty': 'Position cannot be empty'
    })
});

// Update Condition Validation
export const updateConditionValidation = Joi.object({
  condition: Joi.string()
    .valid('good', 'worn', 'critical')
    .required()
    .messages({
      'any.only': 'Condition must be good, worn, or critical',
      'any.required': 'Condition is required'
    })
});

// Assign Truck Validation
export const assignTruckValidation = Joi.object({
  truckId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .required()
    .messages({
      'string.pattern.base': 'Invalid truck ID format',
      'any.required': 'Truck ID is required'
    })
});

// ID Param Validation
export const tireIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid tire ID format',
      'any.required': 'Tire ID is required'
    })
});