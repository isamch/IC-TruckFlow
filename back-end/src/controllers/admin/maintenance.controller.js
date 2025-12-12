import MaintenanceLog from "../../models/maintenanceLog.model.js";
import Truck from "../../models/truck.model.js";
import Trip from "../../models/trip.model.js";
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

  const maintenanceLogs = await MaintenanceLog.find()
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

  const total = await MaintenanceLog.countDocuments();

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
  const maintenanceLog = await MaintenanceLog.findById(req.params.id)
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
  const truckExists = await Truck.findById(truck);
  if (!truckExists) {
    return next(ApiError.notFound('Truck not found'));
  }

  // Validate trip if provided
  if (trip) {
    const tripExists = await Trip.findById(trip);
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

  const newMaintenanceLog = await MaintenanceLog.create(maintenanceLogData);

  // Add maintenance log to trip's maintenanceLogs array if trip is provided
  if (trip) {
    await Trip.findByIdAndUpdate(trip, {
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

  const maintenanceLog = await MaintenanceLog.findById(req.params.id);

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  // Validate truck if being changed
  if (truck && truck !== MaintenanceLog.Truck.toString()) {
    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return next(ApiError.notFound('Truck not found'));
    }
  }

  // Validate trip if being changed
  if (trip !== undefined && trip !== MaintenanceLog.trip?.toString()) {
    if (trip !== null) {
      const tripExists = await Trip.findById(trip);
      if (!tripExists) {
        return next(ApiError.notFound('Trip not found'));
      }
    }

    // Remove from old trip if exists
    if (MaintenanceLog.trip) {
      await Trip.findByIdAndUpdate(MaintenanceLog.trip, {
        $pull: { maintenanceLogs: MaintenanceLog._id }
      });
    }

    // Add to new trip if provided
    if (trip) {
      await Trip.findByIdAndUpdate(trip, {
        $push: { maintenanceLogs: MaintenanceLog._id }
      });
    }
  }

  // Update fields
  if (truck) MaintenanceLog.truck = truck;
  if (trip !== undefined) MaintenanceLog.trip = trip;
  if (type) MaintenanceLog.type = type;
  if (description !== undefined) MaintenanceLog.description = description;
  if (cost !== undefined) MaintenanceLog.cost = cost;
  if (date) MaintenanceLog.date = date;

  await MaintenanceLog.save();

  await MaintenanceLog.populate('truck trip');

  return successResponse(res, 200, "Maintenance log updated successfully", maintenanceLog);
});





/**
 * @desc    Delete maintenance log
 * @route   DELETE /api/v1/admin/maintenance-logs/:id
 * @access  Private/Admin
 */
export const deleteMaintenanceLog = asyncHandler(async (req, res, next) => {
  const maintenanceLog = await MaintenanceLog.findById(req.params.id);

  if (!maintenanceLog) {
    return next(ApiError.notFound("Maintenance log not found"));
  }

  // Remove from trip's maintenanceLogs array if exists
  if (MaintenanceLog.trip) {
    await Trip.findByIdAndUpdate(MaintenanceLog.trip, {
      $pull: { maintenanceLogs: MaintenanceLog._id }
    });
  }

  await MaintenanceLog.deleteOne();

  return successResponse(res, 200, "Maintenance log deleted successfully");
});