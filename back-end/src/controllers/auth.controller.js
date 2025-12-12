// Authentication Controller
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { comparePassword } from "../utils/hashing.js";
import { generateAccessToken, generateRefreshToken, decode, verifyRefreshToken } from "../utils/jwt.js";
import { successResponse } from "../utils/apiResponse.js";
import * as ApiError from '../utils/apiError.js'




/**
 * @desc    Save refresh token
 * @access  Public
 */
const saveToken = async (userId, refreshToken) => {
  await Token.deleteOne({ userId })
  await Token.create({ userId, token: refreshToken })
}


/**
 * @desc    Login user (Admin or Driver)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.passwordHash || !(await comparePassword(password, user.passwordHash))) {
    return next(ApiError.unauthorized('Invalid email or password'))
  }


  if (!user.isActive) {
    return next(ApiError.unauthorized('User is not active'))
  }

  const payload = {
    id: user.id,
    role: user.role,
    email: user.email
  }

  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  await saveToken(user.id, refreshToken)
  const accessTokenData = decode(accessToken)



  return successResponse(res, 200, 'Login successful', {
    user,
    accessToken,
    refreshToken,
    expiresIn: accessTokenData.exp * 1000 - Date.now()
  })


});




/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refresh = asyncHandler(async (req, res, next) => {

  const { refreshToken } = req.body;

  if (!refreshToken) return next(ApiError.unauthorized('No refresh token provided'));

  const existingToken = await Token.findOne({ token: refreshToken });
  if (!existingToken) return next(ApiError.unauthorized('Invalid refresh token'));

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return next(ApiError.unauthorized('Invalid or expired refresh token'));
  }

  const { exp, iat, ...restPayload } = payload;

  const newAccessToken = generateAccessToken(restPayload);

  return successResponse(res, 200, 'Access token refreshed', { accessToken: newAccessToken });

});



/**
 * @desc    Logout user (Admin or Driver)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res, next) => {

  const deletedToken = await Token.deleteOne({ userId: req.user.id });

  if (!deletedToken) {
    return next(ApiError.notFound('Token not found'))
  }

  return successResponse(res, 200, 'Logout successful');
});



/**
 * @desc    Get current user info
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.userId).select("-passwordHash");

  if (!user) {
    return next(ApiError.notFound('User not found'))
  }

  return successResponse(res, 200, 'User info retrieved successfully', user);
});