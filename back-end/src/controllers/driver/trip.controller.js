import Trip from "../../models/trip.model.js";
import Truck from "../../models/truck.model.js";
import Trailer from "../../models/trailer.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";



/**
 * @desc    Get driver's trips
 * @route   GET /api/v1/driver/trips
 * @access  Private/Driver
 */
export const getMyTrips = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const trips = await Trip.find({ driver: req.user.userId })
    .populate('truck', 'registrationNumber brand model')
    .populate('trailer', 'serialNumber type')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  const total = await Trip.countDocuments({ driver: req.user.userId });

  return successResponse(res, 200, "Trips fetched successfully", {
    trips,
    pagination: { page, perPage, total }
  });
});



/**
 * @desc    Get single trip (driver's own)
 * @route   GET /api/v1/driver/trips/:id
 * @access  Private/Driver
 */
export const getMyTripById = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    driver: req.user.userId
  })
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
 * @desc    Start trip
 * @route   PATCH /api/v1/driver/trips/:id/start
 * @access  Private/Driver
 */
export const startTrip = asyncHandler(async (req, res, next) => {
  const { startKm } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.id,
    driver: req.user.userId
  });

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  if (trip.status !== 'to_do') {
    return next(ApiError.badRequest('Trip already started or finished'));
  }

  trip.status = 'in_progress';
  trip.startKm = startKm;
  await trip.save();

  // Update truck and trailer status
  await Truck.findByIdAndUpdate(trip.truck, { status: 'on_trip' });
  if (trip.trailer) {
    await Trailer.findByIdAndUpdate(Trip.trailer, { status: 'on_trip' });
  }

  await Trip.populate('truck trailer');

  return successResponse(res, 200, "Trip started successfully", trip);
});






/**
 * @desc    Finish trip
 * @route   PATCH /api/v1/driver/trips/:id/finish
 * @access  Private/Driver
 */
export const finishTrip = asyncHandler(async (req, res, next) => {
  const { endKm, fuelUsed, notes } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.id,
    driver: req.user.userId,
  });

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  if (trip.status !== 'in_progress') {
    return next(ApiError.badRequest('Trip is not in progress'));
  }

  if (endKm <= trip.startKm) {
    return next(ApiError.badRequest('End km must be greater than start km'));
  }

  trip.status = 'finished';
  trip.endKm = endKm;
  trip.totalDistance = endKm - trip.startKm;
  if (fuelUsed) trip.fuelUsed = fuelUsed;

  if (notes) {
    const driverName = trip.driver ? trip.driver.name : "Driver";
    if (trip.notes) {
      trip.notes = trip.notes + " . driver : " + driverName + " : " + notes;
    } else {
      trip.notes = "driver : " + driverName + " : " + notes;
    }
  }

  await trip.save();

  // Update truck and trailer status
  await Truck.findByIdAndUpdate(trip.truck, {
    status: 'available',
    currentKm: endKm
  });

  if (trip.trailer) {
    await Trailer.findByIdAndUpdate(trip.trailer, { status: 'available' });
  }

  await trip.populate('truck trailer');

  return successResponse(res, 200, "Trip finished successfully", trip);
});




/**
 * @desc    Update trip notes
 * @route   PATCH /api/v1/driver/trips/:id/update-notes
 * @access  Private/Driver
 */
export const updateTripNotes = asyncHandler(async (req, res, next) => {
  const { notes } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.id,
    driver: req.user.userId
  });

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  trip.notes = notes;
  await trip.save();

  return successResponse(res, 200, "Trip notes updated successfully", trip);
});