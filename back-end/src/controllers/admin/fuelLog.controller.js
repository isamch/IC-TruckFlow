import FuelLog from "../../models/fuelLog.model.js";
import Trip from "../../models/trip.model.js";
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

  const fuelLogs = await FuelLog.find()
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

  const total = await FuelLog.countDocuments();

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
  const fuelLog = await FuelLog.findById(req.params.id)
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
  const tripExists = await Trip.findById(trip);
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

  const newFuelLog = await FuelLog.create(fuelLogData);

  // Add fuel log to trip's fuelLogs array
  await Trip.findByIdAndUpdate(trip, {
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

  const fuelLog = await FuelLog.findById(req.params.id);

  if (!fuelLog) {
    return next(ApiError.notFound("Fuel log not found"));
  }

  // Validate trip if being changed
  if (trip && trip !== FuelLog.Trip.toString()) {
    const tripExists = await Trip.findById(trip);
    if (!tripExists) {
      return next(ApiError.notFound('Trip not found'));
    }

    // Remove from old trip
    await Trip.findByIdAndUpdate(FuelLog.trip, {
      $pull: { fuelLogs: FuelLog._id }
    });

    // Add to new trip
    await Trip.findByIdAndUpdate(trip, {
      $push: { fuelLogs: FuelLog._id }
    });
  }

  // Update fields
  if (trip) FuelLog.trip = trip;
  if (liters !== undefined) FuelLog.liters = liters;
  if (pricePerLiter !== undefined) FuelLog.pricePerLiter = pricePerLiter;
  if (stationName !== undefined) FuelLog.stationName = stationName;
  if (timestamp) FuelLog.timestamp = timestamp;

  // Recalculate total cost
  if (FuelLog.liters && FuelLog.pricePerLiter) {
    FuelLog.totalCost = FuelLog.liters * FuelLog.pricePerLiter;
  }

  await FuelLog.save();

  await FuelLog.populate({
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
  const fuelLog = await FuelLog.findById(req.params.id);

  if (!fuelLog) {
    return next(ApiError.notFound("Fuel log not found"));
  }

  // Remove from trip's fuelLogs array
  await Trip.findByIdAndUpdate(FuelLog.trip, {
    $pull: { fuelLogs: FuelLog._id }
  });

  await FuelLog.deleteOne();

  return successResponse(res, 200, "Fuel log deleted successfully");
});