import Trailer from "../../models/trailer.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";


/**
 * @desc    Get all trailers (with pagination & filters)
 * @route   GET /api/v1/admin/trailers
 * @access  Private/Admin
 */
export const getAllTrailers = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const trailers = await Trailer.find()
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!trailers) {
    return next(ApiError.notFound("Trailers not found"));
  }

  const total = await Trailer.countDocuments();

  return successResponse(res, 200, "Trailers fetched successfully", {
    trailers,
    pagination: { page, perPage, total }
  });
});



/**
 * @desc    Get single trailer by ID
 * @route   GET /api/v1/admin/trailers/:id
 * @access  Private/Admin
 */
export const getTrailerById = asyncHandler(async (req, res, next) => {
  const trailer = await Trailer.findById(req.params.id);

  if (!trailer) {
    return next(ApiError.notFound("Trailer not found"));
  }

  return successResponse(res, 200, "Trailer fetched successfully", trailer);
});


/**
 * @desc    Create new trailer
 * @route   POST /api/v1/admin/trailers
 * @access  Private/Admin
 */
export const createTrailer = asyncHandler(async (req, res, next) => {
  const { serialNumber, type, maxLoadKg, status, lastCheckDate } = req.body;

  // Check if serial number already exists
  const existingTrailer = await Trailer.findOne({ serialNumber });
  if (existingTrailer) {
    return next(ApiError.badRequest('Serial number already exists'));
  }

  const trailerData = {
    serialNumber,
    type,
    maxLoadKg,
    status: status || 'available',
    lastCheckDate
  };

  const newTrailer = await Trailer.create(trailerData);

  return successResponse(res, 201, "Trailer created successfully", newTrailer);
});




/**
 * @desc    Update trailer
 * @route   PUT /api/v1/admin/trailers/:id
 * @access  Private/Admin
 */
export const updateTrailer = asyncHandler(async (req, res, next) => {
  const { serialNumber, type, maxLoadKg, status, lastCheckDate } = req.body;

  const trailer = await Trailer.findById(req.params.id);

  if (!trailer) {
    return next(ApiError.notFound("Trailer not found"));
  }

  // Check if serial number is being changed and already exists
  if (serialNumber && serialNumber !== Trailer.serialNumber) {
    const existingTrailer = await Trailer.findOne({ serialNumber });
    if (existingTrailer) {
      return next(ApiError.badRequest('Serial number already exists'));
    }
  }

  // Update fields
  if (serialNumber) Trailer.serialNumber = serialNumber;
  if (type !== undefined) Trailer.type = type;
  if (maxLoadKg !== undefined) Trailer.maxLoadKg = maxLoadKg;
  if (status) Trailer.status = status;
  if (lastCheckDate !== undefined) Trailer.lastCheckDate = lastCheckDate;

  await Trailer.save();

  return successResponse(res, 200, "Trailer updated successfully", trailer);
});



/**
 * @desc    Delete trailer
 * @route   DELETE /api/v1/admin/trailers/:id
 * @access  Private/Admin
 */
export const deleteTrailer = asyncHandler(async (req, res, next) => {
  const trailer = await Trailer.findByIdAndDelete(req.params.id);

  if (!trailer) {
    return next(ApiError.notFound("Trailer not found"));
  }

  return successResponse(res, 200, "Trailer deleted successfully");
});



/**
 * @desc    Update trailer status
 * @route   PATCH /api/v1/admin/trailers/:id/status
 * @access  Private/Admin
 */
export const updateTrailerStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const trailer = await Trailer.findById(req.params.id);

  if (!trailer) {
    return next(ApiError.notFound("Trailer not found"));
  }

  if (!['available', 'on_trip', 'maintenance'].includes(status)) {
    return next(ApiError.badRequest('Invalid status'));
  }

  Trailer.status = status;
  await Trailer.save();

  return successResponse(res, 200, "Trailer status updated successfully", trailer);
});