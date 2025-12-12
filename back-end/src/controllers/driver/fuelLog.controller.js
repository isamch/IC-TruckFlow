import FuelLog from "../../models/fuelLog.model.js";
import Trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";



/**
 * @desc    Get driver's fuel logs
 * @route   GET /api/v1/driver/fuel-logs
 * @access  Private/Driver
 */
export const getMyFuelLogs = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  // Get trips for this driver
  const myTrips = await Trip.find({ driver: req.User.id }).select('_id');
  const tripIds = myTrips.map(trip => Trip._id);


  const fuelLogs = await FuelLog.find({ trip: { $in: tripIds } })
    .populate({
      path: 'trip',
      populate: { path: 'truck', select: 'registrationNumber brand model' }
    })
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  const total = await FuelLog.countDocuments({ trip: { $in: tripIds } });

  return successResponse(res, 200, "Fuel logs fetched successfully", {
    fuelLogs,
    pagination: { page, perPage, total }
  });
});




/**
 * @desc    Get single fuel log (driver's own)
 * @route   GET /api/v1/driver/fuel-logs/:id
 * @access  Private/Driver
 */
export const getMyFuelLogById = asyncHandler(async (req, res, next) => {
  const fuelLog = await FuelLog.findById(req.params.id)
    .populate({
      path: 'trip',
      populate: { path: 'truck', select: 'registrationNumber brand model' }
    });

  if (!fuelLog) {
    return next(ApiError.notFound("Fuel log not found"));
  }

  // Check if this fuel log belongs to driver's trip
  const trip = await Trip.findById(FuelLog.Trip._id);
  if (Trip.driver.toString() !== req.User.id) {
    return next(ApiError.forbidden("You don't have access to this fuel log"));
  }

  return successResponse(res, 200, "Fuel log fetched successfully", fuelLog);
});



/**
 * @desc    Add fuel log (during trip)
 * @route   POST /api/v1/driver/fuel-logs
 * @access  Private/Driver
 */
export const addFuelLog = asyncHandler(async (req, res, next) => {
  const { trip, liters, pricePerLiter, stationName, timestamp } = req.body;

  // Validate trip exists and belongs to driver
  const tripExists = await Trip.findOne({
    _id: trip,
    driver: req.User.id
  });

  if (!tripExists) {
    return next(ApiError.notFound('Trip not found or does not belong to you'));
  }

  // Check if trip is in progress
  if (tripExists.status !== 'in_progress') {
    return next(ApiError.badRequest('Can only add fuel logs to trips in progress'));
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
    populate: { path: 'truck', select: 'registrationNumber brand model' }
  });

  return successResponse(res, 201, "Fuel log added successfully", newFuelLog);
});