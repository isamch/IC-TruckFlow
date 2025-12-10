import Joi from 'joi';

// Create Maintenance Rule Validation
export const createMaintenanceRuleValidation = Joi.object({
  type: Joi.string()
    .valid('oil', 'tires', 'engine', 'general')
    .required()
    .messages({
      'any.only': 'Type must be oil, tires, engine, or general',
      'any.required': 'Type is required'
    }),

  everyKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Every km must be a number',
      'number.min': 'Every km cannot be negative'
    }),

  everyMonths: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Every months must be a number',
      'number.min': 'Every months cannot be negative'
    })
}).custom((value, helpers) => {
  // At least one of everyKm or everyMonths must be provided
  if (!value.everyKm && !value.everyMonths) {
    return helpers.error('any.custom', {
      message: 'At least one of everyKm or everyMonths must be provided'
    });
  }
  return value;
});

// Update Maintenance Rule Validation
export const updateMaintenanceRuleValidation = Joi.object({
  type: Joi.string()
    .valid('oil', 'tires', 'engine', 'general')
    .optional()
    .messages({
      'any.only': 'Type must be oil, tires, engine, or general'
    }),

  everyKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Every km must be a number',
      'number.min': 'Every km cannot be negative'
    }),

  everyMonths: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Every months must be a number',
      'number.min': 'Every months cannot be negative'
    })
});

// ID Param Validation
export const maintenanceRuleIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid maintenance rule ID format',
      'any.required': 'Maintenance rule ID is required'
    })
});