import Joi from 'joi';

// Login Validation
export const loginValidation = Joi.object({
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
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty'
    })
});


// refresh Validation
export const refreshValidation = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required',
      'string.empty': 'Refresh token cannot be empty'
    })
});