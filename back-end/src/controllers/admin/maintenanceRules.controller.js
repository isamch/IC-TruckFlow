import MaintenanceRules from "../../models/maintenanceRules.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import { getPagination } from "../../utils/pagination.js";


/**
 * @desc    Get all maintenance rules
 * @route   GET /api/v1/admin/maintenance-rules
 * @access  Private/Admin
 */
export const getAllMaintenanceRules = asyncHandler(async (req, res, next) => {
  const { page, perPage, skip } = getPagination(req.query);

  const maintenanceRules = await MaintenanceRules.find()
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 });

  if (!maintenanceRules) {
    return next(ApiError.notFound("Maintenance rules not found"));
  }

  const total = await MaintenanceRules.countDocuments();

  return successResponse(res, 200, "Maintenance rules fetched successfully", {
    maintenanceRules,
    pagination: { page, perPage, total }
  });
});


/**
 * @desc    Get single maintenance rule by ID
 * @route   GET /api/v1/admin/maintenance-rules/:id
 * @access  Private/Admin
 */
export const getMaintenanceRuleById = asyncHandler(async (req, res, next) => {
  const maintenanceRule = await MaintenanceRules.findById(req.params.id);

  if (!maintenanceRule) {
    return next(ApiError.notFound("Maintenance rule not found"));
  }

  return successResponse(res, 200, "Maintenance rule fetched successfully", maintenanceRule);
});



/**
 * @desc    Create new maintenance rule
 * @route   POST /api/v1/admin/maintenance-rules
 * @access  Private/Admin
 */
export const createMaintenanceRule = asyncHandler(async (req, res, next) => {
  const { type, everyKm, everyMonths } = req.body;

  // Check if rule for this type already exists
  const existingRule = await MaintenanceRules.findOne({ type });
  if (existingRule) {
    return next(ApiError.badRequest(`Maintenance rule for type '${type}' already exists`));
  }

  const maintenanceRuleData = {
    type,
    everyKm,
    everyMonths
  };

  const newMaintenanceRule = await MaintenanceRules.create(maintenanceRuleData);

  return successResponse(res, 201, "Maintenance rule created successfully", newMaintenanceRule);
});




/**
 * @desc    Update maintenance rule
 * @route   PUT /api/v1/admin/maintenance-rules/:id
 * @access  Private/Admin
 */
export const updateMaintenanceRule = asyncHandler(async (req, res, next) => {
  const { type, everyKm, everyMonths } = req.body;

  const maintenanceRule = await MaintenanceRules.findById(req.params.id);

  if (!maintenanceRule) {
    return next(ApiError.notFound("Maintenance rule not found"));
  }

  // Check if type is being changed and already exists
  if (type && type !== maintenanceRule.type) {
    const existingRule = await MaintenanceRules.findOne({ type });
    if (existingRule) {
      return next(ApiError.badRequest(`Maintenance rule for type '${type}' already exists`));
    }
  }

  // Update fields
  if (type) maintenanceRule.type = type;
  if (everyKm !== undefined) maintenanceRule.everyKm = everyKm;
  if (everyMonths !== undefined) maintenanceRule.everyMonths = everyMonths;

  await maintenanceRule.save();

  return successResponse(res, 200, "Maintenance rule updated successfully", maintenanceRule);
});


/**
 * @desc    Delete maintenance rule
 * @route   DELETE /api/v1/admin/maintenance-rules/:id
 * @access  Private/Admin
 */
export const deleteMaintenanceRule = asyncHandler(async (req, res, next) => {
  const maintenanceRule = await MaintenanceRules.findByIdAndDelete(req.params.id);

  if (!maintenanceRule) {
    return next(ApiError.notFound("Maintenance rule not found"));
  }

  return successResponse(res, 200, "Maintenance rule deleted successfully");
});