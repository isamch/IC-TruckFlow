import Joi from 'joi'



/**
 * @desc Middleware factory to validate request body, params, and query against a Joi schema
 * @param {object} schema - An object containing optional 'body', 'params', 'query' Joi schemas
 * @returns {function} Express middleware function
 */
export default (schema) => (req, res, next) => {
  // Define a combined schema for validation
  const requestSchema = Joi.object({
    body: schema.body || Joi.object(),
    params: schema.params || Joi.object(),
    query: schema.query || Joi.object()
  })

  // Data object to validate
  const dataToValidate = {
    body: req.body,
    params: req.params,
    query: req.query
  }

  // Perform validation
  const { error, value } = requestSchema.validate(dataToValidate, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: {
      body: true,
      params: true,
      query: true
    }
  })

  if (error) {
    error.isJoi = true
    return next(error)
  }


  Object.assign(req.body, value.body)
  Object.assign(req.params, value.params)
  Object.assign(req.query, value.query)

  next()
}