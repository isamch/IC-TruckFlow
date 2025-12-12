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

  const trips = await Trip.find({ driver: req.User.id })
    .populate('truck', 'registrationNumber brand model')
    .populate('trailer', 'serialNumber type')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  const total = await Trip.countDocuments({ driver: req.User.id });

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
    driver: req.User.id
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
    driver: req.User.id
  });

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  if (Trip.status !== 'to_do') {
    return next(ApiError.badRequest('Trip already started or finished'));
  }

  Trip.status = 'in_progress';
  Trip.startKm = startKm;
  await Trip.save();

  // Update truck and trailer status
  await Truck.findByIdAndUpdate(Trip.truck, { status: 'on_trip' });
  if (Trip.trailer) {
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
    driver: req.User.id,
  });

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  if (Trip.status !== 'in_progress') {
    return next(ApiError.badRequest('Trip is not in progress'));
  }

  if (endKm <= Trip.startKm) {
    return next(ApiError.badRequest('End km must be greater than start km'));
  }

  Trip.status = 'finished';
  Trip.endKm = endKm;
  Trip.totalDistance = endKm - Trip.startKm;
  if (fuelUsed) Trip.fuelUsed = fuelUsed;

  if (notes) {
    const driverName = Trip.driver ? Trip.driver.name : "Driver";
    if (Trip.notes) {
      Trip.notes = Trip.notes + " . driver : " + driverName + " : " + notes;
    } else {
      Trip.notes = "driver : " + driverName + " : " + notes;
    }
  }

  await Trip.save();

  // Update truck and trailer status
  await Truck.findByIdAndUpdate(Trip.truck, {
    status: 'available',
    currentKm: endKm
  });

  if (Trip.trailer) {
    await Trailer.findByIdAndUpdate(Trip.trailer, { status: 'available' });
  }

  await Trip.populate('truck trailer');

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
    driver: req.User.id
  });

  if (!trip) {
    return next(ApiError.notFound("Trip not found"));
  }

  Trip.notes = notes;
  await Trip.save();

  return successResponse(res, 200, "Trip notes updated successfully", trip);
});