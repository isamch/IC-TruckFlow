import { verifyAccessToken } from '../utils/jwt.js'
import { unauthorized, forbidden } from '../utils/apiError.js'
import asyncHandler from '../utils/asyncHandler.js'

/**
 * @desc Middleware to protect routes
 * Verifies JWT and attaches user data and permissions to req.user
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  // Fallback to cookie if not found in header
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) throw unauthorized('Not authorized, no token')

  const payload = verifyAccessToken(token)
  if (!payload) throw unauthorized('Not authorized, token invalid')

  // The payload we created in 'login' contains everything we need
  // No need for a database (DB) hit here, this is very fast
  req.user = {
    userId: payload.id,
    role: payload.role,
  }

  next()
})

