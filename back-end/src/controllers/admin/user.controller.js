import User from "../../models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { hashPassword } from "../../utils/hashing.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";


/**
 * @desc    Get all users (with pagination & filters)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res, next) => {


  const { page, perPage, skip } = getPagination(req.query)


  const users = await User.find()
    .select("-password")
    .skip(skip)
    .limit(perPage);

  if (!users) {
    return next(ApiError.notFound("Users not found"));
  }

  return successResponse(res, 200, "users fetched successfully", {
    users,
    pagination: { page, perPage },
  });

});

