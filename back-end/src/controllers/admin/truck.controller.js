import truck from "../../models/truck.model.js";
import tire from "../../models/tire.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";


/**
 * @desc    Get all trucks (with pagination & filters)
 * @route   GET /api/v1/admin/trucks
 * @access  Private/Admin
 */
export const getAllTrucks = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const trucks = await truck.find()
    .populate('tires')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!trucks) {
    return next(ApiError.notFound("Trucks not found"));
  }

  const total = await truck.countDocuments();

  return successResponse(res, 200, "Trucks fetched successfully", {
    trucks,
    pagination: { page, perPage, total }
  });
});



/**
 * @desc    Get single truck by ID
 * @route   GET /api/v1/admin/trucks/:id
 * @access  Private/Admin
 */
export const getTruckById = asyncHandler(async (req, res, next) => {
  const truck = await truck.findById(req.params.id)
    .populate('tires');

  if (!truck) {
    return next(ApiError.notFound("Truck not found"));
  }

  return successResponse(res, 200, "Truck fetched successfully", truck);
});



/**
 * @desc    Create new truck
 * @route   POST /api/v1/admin/trucks
 * @access  Private/Admin
 */
export const createTruck = asyncHandler(async (req, res, next) => {
  const {
    registrationNumber, brand, model, currentKm,
    fuelCapacity, status, lastOilChangeKm,
    lastGeneralCheckDate, tires
  } = req.body;

  const existingTruck = await truck.findOne({ registrationNumber });

  if (existingTruck) {
    return next(ApiError.badRequest("Truck already exists"));
  }


  // If tires are exist
  if (tires && tires.length > 0) {
    const tiresExist = await tire.countDocuments({ _id: { $in: tires } });
    if (tiresExist !== tires.length) {
      return next(ApiError.badRequest('One or more tire IDs are invalid'));
    }
  }


  const truckData = {
    registrationNumber,
    brand,
    model,
    currentKm: currentKm || 0,
    fuelCapacity,
    status: status || 'available',
    lastOilChangeKm,
    lastGeneralCheckDate,
    tires: tires || []
  };

  const newTruck = await truck.create(truckData);

  return successResponse(res, 201, "Truck created successfully", newTruck);

});




/**
 * @desc    Update truck
 * @route   PUT /api/v1/admin/trucks/:id
 * @access  Private/Admin
 */
export const updateTruck = asyncHandler(async (req, res, next) => {
  const {
    registrationNumber,
    brand,
    model,
    currentKm,
    fuelCapacity,
    status,
    lastOilChangeKm,
    lastGeneralCheckDate,
    tires
  } = req.body;

  const truck = await truck.findById(req.params.id);

  if (!truck) {
    return next(ApiError.notFound("Truck not found"));
  }

  // check if registration number is being changed and already exists
  if (registrationNumber && registrationNumber !== truck.registrationNumber) {
    const existingTruck = await truck.findOne({ registrationNumber });
    if (existingTruck) {
      return next(ApiError.badRequest('Registration number already exists'));
    }
  }


  // If tires are being updated, validate they exist
  if (tires && tires.length > 0) {
    const tiresExist = await tire.countDocuments({ _id: { $in: tires } });
    if (tiresExist !== tires.length) {
      return next(ApiError.badRequest('One or more tire IDs are invalid'));
    }
  }

  // Update fields
  if (registrationNumber) truck.registrationNumber = registrationNumber;
  if (brand !== undefined) truck.brand = brand;
  if (model !== undefined) truck.model = model;
  if (currentKm !== undefined) truck.currentKm = currentKm;
  if (fuelCapacity !== undefined) truck.fuelCapacity = fuelCapacity;
  if (status) truck.status = status;
  if (lastOilChangeKm !== undefined) truck.lastOilChangeKm = lastOilChangeKm;
  if (lastGeneralCheckDate !== undefined) truck.lastGeneralCheckDate = lastGeneralCheckDate;
  if (tires !== undefined) truck.tires = tires;

  await truck.save();

  // get updated truck with populated tires
  await truck.populate('tires');

  return successResponse(res, 200, "Truck updated successfully", truck);
});



/**
 * @desc    Delete truck
 * @route   DELETE /api/v1/admin/trucks/:id
 * @access  Private/Admin
 */
export const deleteTruck = asyncHandler(async (req, res, next) => {
  const truck = await truck.findByIdAndDelete(req.params.id);

  if (!truck) {
    return next(ApiError.notFound("Truck not found"));
  }

  return successResponse(res, 200, "Truck deleted successfully", truck);
});




/**
 * @desc    Update truck status
 * @route   PATCH /api/v1/admin/trucks/:id/status
 * @access  Private/Admin
 */
export const updateTruckStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const truck = await truck.findById(req.params.id);

  if (!truck) {
    return next(ApiError.notFound("Truck not found"));
  }

  if (!['available', 'on_trip', 'maintenance'].includes(status)) {
    return next(ApiError.badRequest('Invalid status'));
  }

  truck.status = status;
  await truck.save();

  return successResponse(res, 200, "Truck status updated successfully", truck);
});





/**
 * @desc    Add tire to truck
 * @route   PATCH /api/v1/admin/trucks/:id/add-tire
 * @access  Private/Admin
 */
export const addTireToTruck = asyncHandler(async (req, res, next) => {
  const { tireId } = req.body;

  const truck = await truck.findById(req.params.id);

  if (!truck) {
    return next(ApiError.notFound("Truck not found"));
  }

  const tire = await tire.findById(tireId);
  if (!tire) {
    return next(ApiError.notFound('Tire not found'));
  }

  if (truck.tires.includes(tireId)) {
    return next(ApiError.badRequest('Tire already added to this truck'));
  }

  truck.tires.push(tireId);
  await truck.save();

  await truck.populate('tires');

  return successResponse(res, 200, "Tire added to truck successfully", truck);
});




/**
 * @desc    Remove tire from truck
 * @route   PATCH /api/v1/admin/trucks/:id/remove-tire
 * @access  Private/Admin
 */
export const removeTireFromTruck = asyncHandler(async (req, res, next) => {
  const { tireId } = req.body;

  const truck = await truck.findById(req.params.id);

  if (!truck) {
    return next(ApiError.notFound("Truck not found"));
  }

  if (!truck.tires.includes(tireId)) {
    return next(ApiError.badRequest('Tire not found in this truck'));
  }

  truck.tires = truck.tires.filter(tire => tire.toString() !== tireId);
  await truck.save();

  await truck.populate('tires');

  return successResponse(res, 200, "Tire removed from truck successfully", truck);
});