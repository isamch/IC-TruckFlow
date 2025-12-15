import MaintenanceLog from "../../models/maintenanceLog.model.js";
import Trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";



/**
 * @desc    Get driver's maintenance logs
 * @route   GET /api/v1/driver/maintenance-logs
 * @access  Private/Driver
 */
export const getMyMaintenanceLogs = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  // Get trips for this driver
  const myTrips = await Trip.find({ driver: req.user.userId }).select('_id');
  const tripIds = myTrips.map(trip => trip._id);

  const maintenanceLogs = await MaintenanceLog.find({ trip: { $in: tripIds } })
    .populate('truck', 'registrationNumber brand model')
    .populate('trip', 'startLocation endLocation status')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  const total = await MaintenanceLog.countDocuments({ trip: { $in: tripIds } });

  return successResponse(res, 200, "Maintenance logs fetched successfully", {
    maintenanceLogs,
    pagination: { page, perPage, total }
  });
});




/**
 * @desc    Get single maintenance log (driver's own)
 * @route   GET /api/v1/driver/maintenance-logs/:id
 * @access  Private/Driver
 */
export const getMyMaintenanceLogById = asyncHandler(async (req, res, next) => {
  const maintenanceLog = await MaintenanceLog.findById(req.params.id)
    .populate('truck', 'registrationNumber brand model')
    .populate('trip', 'startLocation endLocation status');

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  // Check if this maintenance log belongs to driver's trip
  if (maintenanceLog.trip) {
    const trip = await Trip.findById(maintenanceLog.trip);
    if (trip.driver.toString() !== req.user.userId) {
      return next(ApiError.forbidden("You don't have access to this maintenance log"));
    }
  } else {
    return next(ApiError.forbidden("You don't have access to this maintenance log"));
  }

  return successResponse(res, 200, "Maintenance log fetched successfully", maintenanceLog);
});




/**
 * @desc    Add maintenance log (during trip)
 * @route   POST /api/v1/driver/maintenance-logs
 * @access  Private/Driver
 */
export const addMaintenanceLog = asyncHandler(async (req, res, next) => {
  const { trip, type, description, cost, date } = req.body;

  // Validate trip exists and belongs to driver
  const tripExists = await Trip.findOne({
    _id: trip,
    driver: req.user.userId
  });

  if (!tripExists) {
    return next(ApiError.notFound('Trip not found or does not belong to you'));
  }

  // Check if trip is in progress
  if (tripExists.status !== 'in_progress') {
    return next(ApiError.badRequest('Can only add maintenance logs to trips in progress'));
  }

  const maintenanceLogData = {
    truck: tripExists.truck,
    trip,
    type,
    description,
    cost,
    date: date || Date.now()
  };

  const newMaintenanceLog = await MaintenanceLog.create(maintenanceLogData);

  // Add maintenance log to trip's maintenanceLogs array
  await Trip.findByIdAndUpdate(trip, {
    $push: { maintenanceLogs: newMaintenanceLog._id }
  });

  await newMaintenanceLog.populate('truck trip');

  return successResponse(res, 201, "Maintenance log added successfully", newMaintenanceLog);
});



/**
 * @desc    Update maintenance log (driver's own)
 * @route   PUT /api/v1/driver/maintenance-logs/:id
 * @access  Private/Driver
 */
export const updateMyMaintenanceLog = asyncHandler(async (req, res, next) => {
  const { type, description, cost, date } = req.body;

  const maintenanceLog = await MaintenanceLog.findById(req.params.id);

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  // Check if this maintenance log belongs to driver's trip
  if (!maintenanceLog.trip) {
    return next(ApiError.forbidden("You don't have access to this maintenance log"));
  }

  const trip = await Trip.findById(maintenanceLog.trip);
  if (!trip || trip.driver.toString() !== req.user.userId) {
    return next(ApiError.forbidden("You don't have access to this maintenance log"));
  }

  // Update fields
  if (type) maintenanceLog.type = type;
  if (description !== undefined) maintenanceLog.description = description;
  if (cost !== undefined) maintenanceLog.cost = cost;
  if (date) maintenanceLog.date = date;

  await maintenanceLog.save();

  await maintenanceLog.populate('truck trip');

  return successResponse(res, 200, "Maintenance log updated successfully", maintenanceLog);
});




/**
 * @desc    Delete maintenance log (driver's own)
 * @route   DELETE /api/v1/driver/maintenance-logs/:id
 * @access  Private/Driver
 */
export const deleteMyMaintenanceLog = asyncHandler(async (req, res, next) => {
  const maintenanceLog = await MaintenanceLog.findById(req.params.id);

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  // Check if this maintenance log belongs to driver's trip
  if (!maintenanceLog.trip) {
    return next(ApiError.forbidden("You don't have access to this maintenance log"));
  }

  const trip = await Trip.findById(maintenanceLog.trip);
  if (!trip || trip.driver.toString() !== req.user.userId) {
    return next(ApiError.forbidden("You don't have access to this maintenance log"));
  }

  // Remove from trip's maintenanceLogs array
  await Trip.findByIdAndUpdate(maintenanceLog.trip, {
    $pull: { maintenanceLogs: maintenanceLog._id }
  });

  await maintenanceLog.deleteOne();

  return successResponse(res, 200, "Maintenance log deleted successfully");
});