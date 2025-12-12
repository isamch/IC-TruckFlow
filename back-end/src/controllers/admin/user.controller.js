import User from "../../models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { hashPassword } from "../../utils/hashing.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";


/**
 * @desc    Get all users (with pagination & filters)
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res, next) => {


  const { page, perPage, skip } = getPagination(req.query)


  const users = await User.find()
    .select("-passwordHash")
    .skip(skip)
    .limit(perPage);

  if (!users) {
    return next(ApiError.notFound("Users not found"));
  }

  const total = await User.countDocuments();

  return successResponse(res, 200, "users fetched successfully", {
    users,
    pagination: { page, perPage, total }
  });

});




/**
 * @desc    Get single user by ID
 * @route   GET /api/v1/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req, res, next) => {

  // return successResponse(res, 200, "user fetched successfully", { id: req.params.id });

  const user = await User.findById(req.params.id)
    .select("-passwordHash");

  if (!user) {
    return next(ApiError.notFound("User not found"));
  }

  return successResponse(res, 200, "user fetched successfully", user);

});



/**
 * @desc    Create new user (Driver or Admin)
 * @route   POST /api/v1/admin/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req, res, next) => {

  const { fullname, email, password, role, licenseNumber, cin, phone, isActive } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(ApiError.badRequest('Email already exists'));
  }

  const hashedPassword = await hashPassword(password);

  const userData = {
    fullname,
    email,
    passwordHash: hashedPassword,
    role: role || 'driver',
    isActive: isActive !== undefined ? isActive : true
  };

  // Add driver-specific fields if role is driver
  if (role === 'driver') {
    userData.licenseNumber = licenseNumber;
    userData.cin = cin;
    userData.phone = phone;
  }

  const newUser = await User.create(userData);

  return successResponse(res, 201, "user created successfully", newUser);

});




/**
 * @desc    Update user
 * @route   PUT /api/v1/admin/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {

  const { fullname, email, password, role, licenseNumber, cin, phone, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ApiError.notFound("User not found"));
  }

  User.fullname = fullname;
  User.email = email;
  User.role = role;
  User.isActive = isActive;

  if (role === 'driver') {
    User.licenseNumber = licenseNumber;
    User.cin = cin;
    User.phone = phone;
  }

  if (password) {
    User.passwordHash = await hashPassword(password);
  }

  await User.save();

  return successResponse(res, 200, "user updated successfully", user);

});



/**
 * @desc    Delete user (soft delete)
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ApiError.notFound("User not found"));
  }

  await User.remove();

  return successResponse(res, 200, "user deleted successfully");

});



/**
 * @desc    Toggle user active status
 * @route   PATCH /api/v1/admin/users/:id/toggle-active
 * @access  Private/Admin
 */
export const toggleUserActiveStatus = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ApiError.notFound("User not found"));
  }

  User.isActive = !User.isActive;

  await User.save();

  return successResponse(res, 200, "user active status toggled successfully", user);

});
