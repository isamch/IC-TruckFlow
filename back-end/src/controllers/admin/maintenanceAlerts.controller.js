import truck from "../../models/truck.model.js";
import maintenanceRules from "../../models/maintenanceRules.model.js";
import maintenanceLog from "../../models/maintenanceLog.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";

/**
 * @desc    Get trucks that need maintenance soon
 * @route   GET /api/v1/admin/maintenance-alerts
 * @access  Private/Admin
 */
export const getMaintenanceAlerts = asyncHandler(async (req, res, next) => {
  const alerts = [];

  // Get all maintenance rules
  const rules = await maintenanceRules.find();

  // Get all trucks
  const trucks = await truck.find();

  for (const truck of trucks) {
    for (const rule of rules) {
      let alert = null;

      // Check km-based maintenance
      if (rule.everyKm) {
        // Get last maintenance of this type for this truck
        const lastMaintenance = await maintenanceLog.findOne({
          truck: truck._id,
          type: rule.type
        }).sort({ date: -1 });

        const lastMaintenanceKm = lastMaintenance ?
          (await truck.findById(truck._id).select('currentKm')).currentKm -
          (truck.currentKm - (lastMaintenance.date ? 0 : 0)) : 0;

        const kmSinceLastMaintenance = truck.currentKm - lastMaintenanceKm;
        const remainingKm = rule.everyKm - kmSinceLastMaintenance;

        if (remainingKm <= 1000 && remainingKm > 0) {
          alert = {
            truck: {
              _id: truck._id,
              registrationNumber: truck.registrationNumber,
              brand: truck.brand,
              model: truck.model,
              currentKm: truck.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'km',
            remainingKm,
            message: `${truck.registrationNumber} needs ${rule.type} maintenance in ${remainingKm} km`
          };
        } else if (remainingKm <= 0) {
          alert = {
            truck: {
              _id: truck._id,
              registrationNumber: truck.registrationNumber,
              brand: truck.brand,
              model: truck.model,
              currentKm: truck.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'km',
            overdue: true,
            overdueKm: Math.abs(remainingKm),
            message: `${truck.registrationNumber} ${rule.type} maintenance is overdue by ${Math.abs(remainingKm)} km`
          };
        }
      }

      // Check time-based maintenance
      if (rule.everyMonths) {
        const lastMaintenance = await maintenanceLog.findOne({
          truck: truck._id,
          type: rule.type
        }).sort({ date: -1 });

        const lastMaintenanceDate = lastMaintenance ? new Date(lastMaintenance.date) : new Date(truck.createdAt);
        const monthsSinceLastMaintenance = Math.floor((Date.now() - lastMaintenanceDate) / (1000 * 60 * 60 * 24 * 30));
        const remainingMonths = rule.everyMonths - monthsSinceLastMaintenance;

        if (remainingMonths <= 1 && remainingMonths > 0 && !alert) {
          alert = {
            truck: {
              _id: truck._id,
              registrationNumber: truck.registrationNumber,
              brand: truck.brand,
              model: truck.model,
              currentKm: truck.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'time',
            remainingMonths,
            message: `${truck.registrationNumber} needs ${rule.type} maintenance in ${remainingMonths} month(s)`
          };
        } else if (remainingMonths <= 0 && !alert) {
          alert = {
            truck: {
              _id: truck._id,
              registrationNumber: truck.registrationNumber,
              brand: truck.brand,
              model: truck.model,
              currentKm: truck.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'time',
            overdue: true,
            overdueMonths: Math.abs(remainingMonths),
            message: `${truck.registrationNumber} ${rule.type} maintenance is overdue by ${Math.abs(remainingMonths)} month(s)`
          };
        }
      }

      if (alert) {
        alerts.push(alert);
      }
    }
  }

  return successResponse(res, 200, "Maintenance alerts fetched successfully", {
    totalAlerts: alerts.length,
    alerts
  });
});