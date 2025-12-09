import Truck from "../../models/truck.model.js";
import Tire from "../../models/tire.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";


/**
 * @desc    Get all trucks (with pagination & filters)
 * @route   GET /api/v1/admin/trucks
 * @access  Private/Admin
 */
export const getAllTrucks = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const trucks = await Truck.find()
    .populate('tires')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!trucks) {
    return next(ApiError.notFound("Trucks not found"));
  }

  const total = await Truck.countDocuments();

  return successResponse(res, 200, "Trucks fetched successfully", {
    trucks,
    pagination: { page, perPage, total }
  });
});
