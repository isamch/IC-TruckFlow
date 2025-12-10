import maintenanceLog from "../../models/maintenanceLog.model.js";
import truck from "../../models/truck.model.js";
import trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";



/**
 * @desc    Get all maintenance logs (with pagination & filters)
 * @route   GET /api/v1/admin/maintenance-logs
 * @access  Private/Admin
 */
export const getAllMaintenanceLogs = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const maintenanceLogs = await maintenanceLog.find()
    .populate('truck', 'registrationNumber brand model')
    .populate({
      path: 'trip',
      populate: { path: 'driver', select: 'fullname email' }
    })
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!maintenanceLogs) {
    return next(ApiError.notFound("Maintenance logs not found"));
  }

  const total = await maintenanceLog.countDocuments();

  return successResponse(res, 200, "Maintenance logs fetched successfully", {
    maintenanceLogs,
    pagination: { page, perPage, total }
  });
});



/**
 * @desc    Get single maintenance log by ID
 * @route   GET /api/v1/admin/maintenance-logs/:id
 * @access  Private/Admin
 */
export const getMaintenanceLogById = asyncHandler(async (req, res, next) => {
  const maintenanceLog = await maintenanceLog.findById(req.params.id)
    .populate('truck', 'registrationNumber brand model currentKm')
    .populate({
      path: 'trip',
      populate: { path: 'driver', select: 'fullname email phone' }
    });

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  return successResponse(res, 200, "Maintenance log fetched successfully", maintenanceLog);
});



/**
 * @desc    Create new maintenance log
 * @route   POST /api/v1/admin/maintenance-logs
 * @access  Private/Admin
 */
export const createMaintenanceLog = asyncHandler(async (req, res, next) => {
  const { truck, trip, type, description, cost, date } = req.body;

  // Validate truck exists
  const truckExists = await truck.findById(truck);
  if (!truckExists) {
    return next(ApiError.notFound('Truck not found'));
  }

  // Validate trip if provided
  if (trip) {
    const tripExists = await trip.findById(trip);
    if (!tripExists) {
      return next(ApiError.notFound('Trip not found'));
    }
  }

  const maintenanceLogData = {
    truck,
    trip: trip || null,
    type,
    description,
    cost,
    date: date || Date.now()
  };

  const newMaintenanceLog = await maintenanceLog.create(maintenanceLogData);

  // Add maintenance log to trip's maintenanceLogs array if trip is provided
  if (trip) {
    await trip.findByIdAndUpdate(trip, {
      $push: { maintenanceLogs: newMaintenanceLog._id }
    });
  }

  await newMaintenanceLog.populate('truck trip');

  return successResponse(res, 201, "Maintenance log created successfully", newMaintenanceLog);
});




/**
 * @desc    Update maintenance log
 * @route   PUT /api/v1/admin/maintenance-logs/:id
 * @access  Private/Admin
 */
export const updateMaintenanceLog = asyncHandler(async (req, res, next) => {
  const { truck, trip, type, description, cost, date } = req.body;

  const maintenanceLog = await maintenanceLog.findById(req.params.id);

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  // Validate truck if being changed
  if (truck && truck !== maintenanceLog.truck.toString()) {
    const truckExists = await truck.findById(truck);
    if (!truckExists) {
      return next(ApiError.notFound('Truck not found'));
    }
  }

  // Validate trip if being changed
  if (trip !== undefined && trip !== maintenanceLog.trip?.toString()) {
    if (trip !== null) {
      const tripExists = await trip.findById(trip);
      if (!tripExists) {
        return next(ApiError.notFound('Trip not found'));
      }
    }

    // Remove from old trip if exists
    if (maintenanceLog.trip) {
      await trip.findByIdAndUpdate(maintenanceLog.trip, {
        $pull: { maintenanceLogs: maintenanceLog._id }
      });
    }

    // Add to new trip if provided
    if (trip) {
      await trip.findByIdAndUpdate(trip, {
        $push: { maintenanceLogs: maintenanceLog._id }
      });
    }
  }

  // Update fields
  if (truck) maintenanceLog.truck = truck;
  if (trip !== undefined) maintenanceLog.trip = trip;
  if (type) maintenanceLog.type = type;
  if (description !== undefined) maintenanceLog.description = description;
  if (cost !== undefined) maintenanceLog.cost = cost;
  if (date) maintenanceLog.date = date;

  await maintenanceLog.save();

  await maintenanceLog.populate('truck trip');

  return successResponse(res, 200, "Maintenance log updated successfully", maintenanceLog);
});





/**
 * @desc    Delete maintenance log
 * @route   DELETE /api/v1/admin/maintenance-logs/:id
 * @access  Private/Admin
 */
export const deleteMaintenanceLog = asyncHandler(async (req, res, next) => {
  const maintenanceLog = await maintenanceLog.findById(req.params.id);

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  // Remove from trip's maintenanceLogs array if exists
  if (maintenanceLog.trip) {
    await trip.findByIdAndUpdate(maintenanceLog.trip, {
      $pull: { maintenanceLogs: maintenanceLog._id }
    });
  }

  await maintenanceLog.deleteOne();

  return successResponse(res, 200, "Maintenance log deleted successfully");
});