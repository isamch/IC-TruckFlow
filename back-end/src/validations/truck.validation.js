import Joi from 'joi';

// Create Truck Validation
export const createTruckValidation = Joi.object({
  registrationNumber: Joi.string()
    .required()
    .messages({
      'any.required': 'Registration number is required',
      'string.empty': 'Registration number cannot be empty'
    }),

  brand: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Brand cannot be empty'
    }),

  model: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Model cannot be empty'
    }),

  currentKm: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Current km must be a number',
      'number.min': 'Current km cannot be negative'
    }),

  fuelCapacity: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Fuel capacity must be a number',
      'number.min': 'Fuel capacity cannot be negative'
    }),

  status: Joi.string()
    .valid('available', 'on_trip', 'maintenance')
    .default('available')
    .messages({
      'any.only': 'Status must be available, on_trip, or maintenance'
    }),

  lastOilChangeKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Last oil change km must be a number',
      'number.min': 'Last oil change km cannot be negative'
    }),

  lastGeneralCheckDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Last general check date must be a valid date'
    }),

  tires: Joi.array()
    .items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
    )
    .optional()
    .messages({
      'array.base': 'Tires must be an array',
      'string.pattern.base': 'Invalid tire ID format'
    })
});

// Update Truck Validation
export const updateTruckValidation = Joi.object({
  registrationNumber: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Registration number cannot be empty'
    }),

  brand: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Brand cannot be empty'
    }),

  model: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Model cannot be empty'
    }),

  currentKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Current km must be a number',
      'number.min': 'Current km cannot be negative'
    }),

  fuelCapacity: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Fuel capacity must be a number',
      'number.min': 'Fuel capacity cannot be negative'
    }),

  status: Joi.string()
    .valid('available', 'on_trip', 'maintenance')
    .optional()
    .messages({
      'any.only': 'Status must be available, on_trip, or maintenance'
    }),

  lastOilChangeKm: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Last oil change km must be a number',
      'number.min': 'Last oil change km cannot be negative'
    }),

  lastGeneralCheckDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Last general check date must be a valid date'
    }),

  tires: Joi.array()
    .items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
    )
    .optional()
    .messages({
      'array.base': 'Tires must be an array',
      'string.pattern.base': 'Invalid tire ID format'
    })
});

// ID Param Validation
export const truckIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid truck ID format',
      'any.required': 'Truck ID is required'
    })
});


// Update Truck Status Validation
export const updateTruckStatusValidation = Joi.object({
  status: Joi.string()
    .valid('available', 'on_trip', 'maintenance')
    .required()
    .messages({
      'any.only': 'Status must be available, on_trip, or maintenance'
    })
});

// Add Tire Validation
export const addTireValidation = Joi.object({
  tireId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid tire ID format',
      'any.required': 'Tire ID is required'
    })
});

// Remove Tire Validation
export const removeTireValidation = Joi.object({
  tireId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid tire ID format',
      'any.required': 'Tire ID is required'
    })
});
