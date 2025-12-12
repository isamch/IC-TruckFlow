import Joi from 'joi';

// Create User (driver) Validation
export const createUserValidation = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Full name must be at least 3 characters',
      'string.max': 'Full name must not exceed 50 characters',
      'any.required': 'Full name is required',
      'string.empty': 'Full name cannot be empty'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email is not valid',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty'
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty'
    }),

  role: Joi.string()
    .valid('admin', 'driver')
    .default('driver')
    .messages({
      'any.only': 'Role must be admin or driver'
    }),

  // Driver fields (required only for drivers)
  licenseNumber: Joi.string()
    .when('role', {
      is: 'driver',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'License number is required for drivers'
    }),

  cin: Joi.string()
    .when('role', {
      is: 'driver',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'CIN is required for drivers'
    }),

  phone: Joi.string()
    .pattern(/^(\+212|0)[5-7][0-9]{8}$/)
    .when('role', {
      is: 'driver',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'string.pattern.base': 'Phone number is not valid (must be Moroccan)',
      'any.required': 'Phone number is required for drivers'
    }),

  isActive: Joi.boolean()
    .default(true)
});

// Update User Validation
export const updateUserValidation = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 3 characters',
      'string.max': 'Full name must not exceed 50 characters'
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Email is not valid'
    }),

  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Password must be at least 6 characters'
    }),

  licenseNumber: Joi.string().optional(),
  cin: Joi.string().optional(),
  phone: Joi.string()
    .pattern(/^(\+212|0)[5-7][0-9]{8}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number is not valid (must be Moroccan)'
    }),

  isActive: Joi.boolean().optional()
});

// ID Param Validation
export const userIdValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required'
    })
});
