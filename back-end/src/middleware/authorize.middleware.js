import * as ApiError from '../utils/apiError.js';


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authorized, please login'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role(s): ${roles.join(' or ')}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};