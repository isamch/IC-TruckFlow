import Tire from "../../models/Tire.model.js";
import Truck from "../../models/Truck.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";



/**
 * @desc    Get all tires (with pagination & filters)
 * @route   GET /api/v1/admin/tires
 * @access  Private/Admin
 */
export const getAllTires = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const tires = await Tire.find()
    .populate('truck', 'registrationNumber brand model')
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!tires) {
    return next(ApiError.notFound("Tires not found"));
  }

  const total = await Tire.countDocuments();

  return successResponse(res, 200, "Tires fetched successfully", {
    tires,
    pagination: { page, perPage, total }
  });
});



/**
 * @desc    Get single tire by ID
 * @route   GET /api/v1/admin/tires/:id
 * @access  Private/Admin
 */
export const getTireById = asyncHandler(async (req, res, next) => {
  const tire = await Tire.findById(req.params.id)
    .populate('truck', 'registrationNumber brand model');

  if (!tire) {
    return next(ApiError.notFound("Tire not found"));
  }

  return successResponse(res, 200, "Tire fetched successfully", tire);
});




/**
 * @desc    Create new tire
 * @route   POST /api/v1/admin/tires
 * @access  Private/Admin
 */
export const createTire = asyncHandler(async (req, res, next) => {
  const { position, installKm, currentKm, condition, truck } = req.body;

  // If truck is provided, validate it exists
  if (truck) {
    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return next(ApiError.notFound('Truck not found'));
    }
  }

  const tireData = {
    position,
    installKm,
    currentKm: currentKm || 0,
    condition: condition || 'good',
    truck: truck || null
  };

  const newTire = await Tire.create(tireData);

  // If truck is assigned, add tire to truck's tires array
  if (truck) {
    const truck = await Truck.findById(truck);
    if (!truck) {
      return next(ApiError.notFound("Truck not found"));
    }

    if (!Truck.tires.includes(newTire._id)) {
      Truck.tires.push(newTire._id);
    }
    await Truck.save();

  }

  // Populate truck info
  await newTire.populate('truck', 'registrationNumber brand model');

  return successResponse(res, 201, "Tire created successfully", newTire);
});




/**
 * @desc    Update tire
 * @route   PUT /api/v1/admin/tires/:id
 * @access  Private/Admin
 */
export const updateTire = asyncHandler(async (req, res, next) => {
  const { position, installKm, currentKm, condition, truck } = req.body;

  const tire = await Tire.findById(req.params.id);

  if (!tire) {
    return next(ApiError.notFound("Tire not found"));
  }

  // If truck is being changed, validate it exists
  if (truck !== undefined && truck !== null) {
    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return next(ApiError.notFound('Truck not found'));
    }

    // Remove tire from old truck if exists
    if (Tire.truck) {
      const oldTruck = await Truck.findById(Tire.truck);
      oldTruck.tires = oldTruck.tires.filter(id => id.toString() !== Tire._id.toString());
      await oldTruck.save();
    }

    // add tire to new truck
    if (!Truck.tires.includes(Tire._id)) {
      Truck.tires.push(Tire._id);
      await Truck.save();
    }
  }

  // Update fields
  if (position) Tire.position = position;
  if (installKm !== undefined) Tire.installKm = installKm;
  if (currentKm !== undefined) Tire.currentKm = currentKm;
  if (condition) Tire.condition = condition;
  if (truck !== undefined) Tire.truck = truck;

  await Tire.save();

  // Populate truck info
  await Tire.populate('truck', 'registrationNumber brand model');

  return successResponse(res, 200, "Tire updated successfully", tire);
});



/**
 * @desc    Delete tire
 * @route   DELETE /api/v1/admin/tires/:id
 * @access  Private/Admin
 */
export const deleteTire = asyncHandler(async (req, res, next) => {
  const tire = await Tire.findById(req.params.id);

  if (!tire) {
    return next(ApiError.notFound("Tire not found"));
  }

  // Remove tire from truck if assigned
  if (Tire.truck) {
    const truck = await Truck.findById(Tire.truck);
    Truck.tires = Truck.tires.filter((id) => id.toString() !== Tire._id.toString());
    await Truck.save();
  }

  await Tire.deleteOne();

  return successResponse(res, 200, "Tire deleted successfully");
});




/**
 * @desc    Change tire position
 * @route   PATCH /api/v1/admin/tires/:id/change-position
 * @access  Private/Admin
 */
export const changeTirePosition = asyncHandler(async (req, res, next) => {
  const { position } = req.body;

  const tire = await Tire.findById(req.params.id);

  if (!tire) {
    return next(ApiError.notFound("Tire not found"));
  }

  Tire.position = position;
  await Tire.save();

  await Tire.populate('truck', 'registrationNumber brand model');

  return successResponse(res, 200, "Tire position changed successfully", tire);
});




/**
 * @desc    Update tire condition
 * @route   PATCH /api/v1/admin/tires/:id/update-condition
 * @access  Private/Admin
 */
export const updateTireCondition = asyncHandler(async (req, res, next) => {
  const { condition } = req.body;

  const tire = await Tire.findById(req.params.id);

  if (!tire) {
    return next(ApiError.notFound("Tire not found"));
  }

  if (!['good', 'worn', 'critical'].includes(condition)) {
    return next(ApiError.badRequest('Invalid condition'));
  }

  Tire.condition = condition;
  await Tire.save();

  await Tire.populate('truck', 'registrationNumber brand model');

  return successResponse(res, 200, "Tire condition updated successfully", tire);
});




/** 
 * @desc    Assign tire to truck
 * @route   PATCH /api/v1/admin/tires/:id/assign-truck
 * @access  Private/Admin
 */
export const assignTireToTruck = asyncHandler(async (req, res, next) => {
  const { truckId } = req.body;

  const tire = await Tire.findById(req.params.id);

  if (!tire) {
    return next(ApiError.notFound("Tire not found"));
  }

  // If truckId is null, unassign tire
  if (truckId === null) {
    // Remove tire from old truck if exists
    if (Tire.truck) {
      const oldTruck = await Truck.findById(Tire.truck);
      oldTruck.tires = oldTruck.tires.filter(id => id.toString() !== Tire._id.toString());
      await oldTruck.save();
    }

    // remove truck from tire
    Tire.truck = null;
    await Tire.save();

    return successResponse(res, 200, "Tire unassigned successfully", tire);
  }

  // Check if truck exists
  const truck = await Truck.findById(truckId);
  if (!truck) {
    return next(ApiError.notFound('Truck not found'));
  }

  // Remove tire from old truck if exists
  if (Tire.truck) {
    const oldTruck = await Truck.findById(Tire.truck);
    oldTruck.tires = oldTruck.tires.filter(id => id.toString() !== Tire._id.toString());
    await oldTruck.save();
  }

  // Add tire to new truck
  const newTruck = await Truck.findById(truckId);
  newTruck.tires.push(Tire._id);
  await newTruck.save();

  // add truck to tire
  Tire.truck = truckId;
  await Tire.save();

  await Tire.populate('truck', 'registrationNumber brand model');

  return successResponse(res, 200, "Tire assigned to truck successfully", tire);
});


