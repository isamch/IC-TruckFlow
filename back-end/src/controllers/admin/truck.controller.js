import truck from "../../models/truck.model.js";
import tire from "../../models/tire.model.js";
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

  const trucks = await truck.find()
    .populate('tires')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!trucks) {
    return next(ApiError.notFound("Trucks not found"));
  }

  const total = await truck.countDocuments();

  return successResponse(res, 200, "Trucks fetched successfully", {
    trucks,
    pagination: { page, perPage, total }
  });
});



/**
 * @desc    Get single truck by ID
 * @route   GET /api/v1/admin/trucks/:id
 * @access  Private/Admin
 */
export const getTruckById = asyncHandler(async (req, res, next) => {
  const truck = await truck.findById(req.params.id)
    .populate('tires');

  if (!truck) {
    return next(ApiError.notFound("Truck not found"));
  }

  return successResponse(res, 200, "Truck fetched successfully", truck);
});


