import fuelLog from "../../models/fuelLog.model.js";
import trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";



/**
 * @desc    Get all fuel logs (with pagination & filters)
 * @route   GET /api/v1/admin/fuel-logs
 * @access  Private/Admin
 */
export const getAllFuelLogs = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const fuelLogs = await fuelLog.find()
    .populate({
      path: 'trip',
      populate: [
        { path: 'driver', select: 'fullname email' },
        { path: 'truck', select: 'registrationNumber brand model' }
      ]
    })
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!fuelLogs) {
    return next(ApiError.notFound("Fuel logs not found"));
  }

  const total = await fuelLog.countDocuments();

  return successResponse(res, 200, "Fuel logs fetched successfully", {
    fuelLogs,
    pagination: { page, perPage, total }
  });
});



/**
 * @desc    Get single fuel log by ID
 * @route   GET /api/v1/admin/fuel-logs/:id
 * @access  Private/Admin
 */
export const getFuelLogById = asyncHandler(async (req, res, next) => {
  const fuelLog = await fuelLog.findById(req.params.id)
    .populate({
      path: 'trip',
      populate: [
        { path: 'driver', select: 'fullname email phone' },
        { path: 'truck', select: 'registrationNumber brand model' }
      ]
    });

  if (!fuelLog) {
    return next(ApiError.notFound("Fuel log not found"));
  }

  return successResponse(res, 200, "Fuel log fetched successfully", fuelLog);
});



/**
 * @desc    Create new fuel log
 * @route   POST /api/v1/admin/fuel-logs
 * @access  Private/Admin
 */
export const createFuelLog = asyncHandler(async (req, res, next) => {
  const { trip, liters, pricePerLiter, stationName, timestamp } = req.body;

  // Validate trip exists
  const tripExists = await trip.findById(trip);
  if (!tripExists) {
    return next(ApiError.notFound('Trip not found'));
  }

  const fuelLogData = {
    trip,
    liters,
    pricePerLiter,
    stationName,
    timestamp: timestamp || Date.now()
  };

  // Calculate total cost if pricePerLiter is provided
  if (pricePerLiter) {
    fuelLogData.totalCost = liters * pricePerLiter;
  }

  const newFuelLog = await fuelLog.create(fuelLogData);

  // Add fuel log to trip's fuelLogs array
  await trip.findByIdAndUpdate(trip, {
    $push: { fuelLogs: newFuelLog._id }
  });


  await newFuelLog.populate({
    path: 'trip',
    populate: [
      { path: 'driver', select: 'fullname email' },
      { path: 'truck', select: 'registrationNumber brand model' }
    ]
  });

  return successResponse(res, 201, "Fuel log created successfully", newFuelLog);
});



/**
 * @desc    Update fuel log
 * @route   PUT /api/v1/admin/fuel-logs/:id
 * @access  Private/Admin
 */
export const updateFuelLog = asyncHandler(async (req, res, next) => {
  const { trip, liters, pricePerLiter, stationName, timestamp } = req.body;

  const fuelLog = await fuelLog.findById(req.params.id);

  if (!fuelLog) {
    return next(ApiError.notFound("Fuel log not found"));
  }

  // Validate trip if being changed
  if (trip && trip !== fuelLog.trip.toString()) {
    const tripExists = await trip.findById(trip);
    if (!tripExists) {
      return next(ApiError.notFound('Trip not found'));
    }

    // Remove from old trip
    await trip.findByIdAndUpdate(fuelLog.trip, {
      $pull: { fuelLogs: fuelLog._id }
    });

    // Add to new trip
    await trip.findByIdAndUpdate(trip, {
      $push: { fuelLogs: fuelLog._id }
    });
  }

  // Update fields
  if (trip) fuelLog.trip = trip;
  if (liters !== undefined) fuelLog.liters = liters;
  if (pricePerLiter !== undefined) fuelLog.pricePerLiter = pricePerLiter;
  if (stationName !== undefined) fuelLog.stationName = stationName;
  if (timestamp) fuelLog.timestamp = timestamp;

  // Recalculate total cost
  if (fuelLog.liters && fuelLog.pricePerLiter) {
    fuelLog.totalCost = fuelLog.liters * fuelLog.pricePerLiter;
  }

  await fuelLog.save();

  await fuelLog.populate({
    path: 'trip',
    populate: [
      { path: 'driver', select: 'fullname email' },
      { path: 'truck', select: 'registrationNumber brand model' }
    ]
  });

  return successResponse(res, 200, "Fuel log updated successfully", fuelLog);
});



/**
 * @desc    Delete fuel log
 * @route   DELETE /api/v1/admin/fuel-logs/:id
 * @access  Private/Admin
 */
export const deleteFuelLog = asyncHandler(async (req, res, next) => {
  const fuelLog = await fuelLog.findById(req.params.id);

  if (!fuelLog) {
    return next(ApiError.notFound("Fuel log not found"));
  }

  // Remove from trip's fuelLogs array
  await trip.findByIdAndUpdate(fuelLog.trip, {
    $pull: { fuelLogs: fuelLog._id }
  });

  await fuelLog.deleteOne();

  return successResponse(res, 200, "Fuel log deleted successfully");
});