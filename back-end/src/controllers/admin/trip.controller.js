import Trip from "../../models/trip.model.js";
import User from "../../models/user.model.js";
import Truck from "../../models/truck.model.js";
import Trailer from "../../models/trailer.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";





/**
 * @desc    Get all trips (with pagination & filters)
 * @route   GET /api/v1/admin/trips
 * @access  Private/Admin
 */
export const getAllTrips = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const trips = await Trip.find()
    .populate('driver', 'fullname email phone')
    .populate('truck', 'registrationNumber brand model')
    .populate('trailer', 'serialNumber type')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!trips) {
    return next(ApiError.notFound("Trips not found"));
  }

  const total = await Trip.countDocuments();

  return successResponse(res, 200, "Trips fetched successfully", {
    trips,
    pagination: { page, perPage, total }
  });
});




/**
 * @desc    Get single trip by ID
 * @route   GET /api/v1/admin/trips/:id
 * @access  Private/Admin
 */
export const getTripById = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id)
    .populate('driver', 'fullname email phone licenseNumber')
    .populate('truck', 'registrationNumber brand model currentKm')
    .populate('trailer', 'serialNumber type maxLoadKg')
    .populate('fuelLogs')
    .populate('maintenanceLogs');

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  return successResponse(res, 200, "Trip fetched successfully", trip);
});



/**
 * @desc    Create new trip
 * @route   POST /api/v1/admin/trips
 * @access  Private/Admin
 */

export const createTrip = asyncHandler(async (req, res, next) => {

  const { driver, truck, trailer, startLocation, endLocation, plannedDate, status, startKm, endKm, fuelUsed, notes } = req.body;


  // Validate driver exists and is a driver
  const driverExists = await User.findById(driver);
  if (!driverExists) {
    return next(ApiError.notFound('Driver not found'));
  }
  if (driverExists.role !== 'driver') {
    return next(ApiError.badRequest('User must have driver role'));
  }


  // Validate truck exists and is available
  const truckExists = await Truck.findById(truck);
  if (!truckExists) {
    return next(ApiError.notFound('Truck not found'));
  }
  if (truckExists.status !== 'available' && status === 'in_progress') {
    return next(ApiError.badRequest('Truck is not available'));
  }


  // Validate trailer if exists
  if (trailer) {
    const trailerExists = await Trailer.findById(trailer);
    if (!trailerExists) {
      return next(ApiError.notFound('Trailer not found'));
    }
    if (trailerExists.status !== 'available' && status === 'in_progress') {
      return next(ApiError.badRequest('Trailer is not available'));
    }
  }



  const tripData = {
    driver,
    truck,
    trailer: trailer || null,
    startLocation,
    endLocation,
    plannedDate,
    status: status || 'to_do',
    startKm,
    endKm,
    fuelUsed,
    notes
  };


  // Calculate total distance if both startKm and endKm are provided
  if (startKm && endKm) {
    tripData.totalDistance = endKm - startKm;
  }

  const newTrip = await Trip.create(tripData);


  // Update truck and trailer status if trip is in_progress
  if (status === 'in_progress') {
    await Truck.findByIdAndUpdate(truck, { status: 'on_trip' });
    if (trailer) {
      await Trailer.findByIdAndUpdate(trailer, { status: 'on_trip' });
    }
  }

  await newTrip.populate('driver truck trailer');

  return successResponse(res, 201, "Trip created successfully", newTrip);

});





/**
 * @desc    Update trip
 * @route   PUT /api/v1/admin/trips/:id
 * @access  Private/Admin
 */

export const updateTrip = asyncHandler(async (req, res, next) => {
  const { driver, truck, trailer, startLocation, endLocation, plannedDate, status, startKm, endKm, fuelUsed, notes } = req.body;

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  // Validate driver if being changed
  if (driver && driver !== Trip.driver.toString()) {
    const driverExists = await User.findById(driver);
    if (!driverExists || driverExists.role !== 'driver') {
      return next(ApiError.badRequest('Invalid driver'));
    }
  }

  // Validate truck if being changed
  if (truck && truck !== Trip.Truck.toString()) {
    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return next(ApiError.notFound('Truck not found'));
    }
  }

  // Validate trailer if being changed
  if (trailer && trailer !== Trip.trailer?.toString()) {
    const trailerExists = await Trailer.findById(trailer);
    if (!trailerExists) {
      return next(ApiError.notFound('Trailer not found'));
    }
  }

  // Update fields
  if (driver) Trip.driver = driver;
  if (truck) Trip.truck = truck;
  if (trailer !== undefined) Trip.trailer = trailer;
  if (startLocation) Trip.startLocation = startLocation;
  if (endLocation) Trip.endLocation = endLocation;
  if (plannedDate) Trip.plannedDate = plannedDate;
  if (status) Trip.status = status;
  if (startKm !== undefined) Trip.startKm = startKm;
  if (endKm !== undefined) Trip.endKm = endKm;
  if (fuelUsed !== undefined) Trip.fuelUsed = fuelUsed;
  if (notes !== undefined) Trip.notes = notes;

  // Recalculate total distance
  if (Trip.startKm && Trip.endKm) {
    Trip.totalDistance = Trip.endKm - Trip.startKm;
  }

  await Trip.save();
  await Trip.populate('driver truck trailer');

  return successResponse(res, 200, "Trip updated successfully", trip);
});



/**
 * @desc    Delete trip
 * @route   DELETE /api/v1/admin/trips/:id
 * @access  Private/Admin
 */
export const deleteTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  return successResponse(res, 200, "Trip deleted successfully");
});