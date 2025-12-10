import Truck from "../../models/truck.model.js";
import MaintenanceRules from "../../models/maintenanceRules.model.js";
import MaintenanceLog from "../../models/maintenanceLog.model.js";
import Trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";


/**
 * @desc    Get maintenance alerts for driver's current truck
 * @route   GET /api/v1/driver/my-truck-alerts
 * @access  Private/Driver
 */
export const getMyTruckAlerts = asyncHandler(async (req, res, next) => {
  // Get driver's active trip
  const activeTrip = await Trip.findOne({
    driver: req.user.id,
    status: 'in_progress'
  }).populate('truck');

  if (!activeTrip) {
    return successResponse(res, 200, "No active trip found", {
      hasActiveTrip: false,
      alerts: []
    });
  }

  const truck = activeTrip.truck;
  const alerts = [];

  // Get all maintenance rules
  const rules = await MaintenanceRules.find();

  for (const rule of rules) {
    let alert = null;

    // Check km-based maintenance
    if (rule.everyKm) {
      // Get last maintenance of this type for this truck
      const lastMaintenance = await MaintenanceLog.findOne({
        truck: truck._id,
        type: rule.type
      }).sort({ date: -1 });

      const lastMaintenanceKm = lastMaintenance ?
        (lastMaintenance.date ? truck.currentKm - (truck.currentKm - truck.lastOilChangeKm || 0) : 0) : 0;

      const kmSinceLastMaintenance = truck.currentKm - lastMaintenanceKm;
      const remainingKm = rule.everyKm - kmSinceLastMaintenance;

      if (remainingKm <= 1000 && remainingKm > 0) {
        alert = {
          maintenanceType: rule.type,
          alertType: 'km',
          severity: remainingKm <= 500 ? 'high' : 'medium',
          remainingKm,
          message: `${rule.type} maintenance needed in ${remainingKm} km`
        };
      } else if (remainingKm <= 0) {
        alert = {
          maintenanceType: rule.type,
          alertType: 'km',
          severity: 'critical',
          overdue: true,
          overdueKm: Math.abs(remainingKm),
          message: `${rule.type} maintenance is overdue by ${Math.abs(remainingKm)} km!`
        };
      }
    }

    // Check time-based maintenance
    if (rule.everyMonths && !alert) {
      const lastMaintenance = await MaintenanceLog.findOne({
        truck: truck._id,
        type: rule.type
      }).sort({ date: -1 });

      const lastMaintenanceDate = lastMaintenance ?
        new Date(lastMaintenance.date) : new Date(truck.createdAt);
      const monthsSinceLastMaintenance = Math.floor(
        (Date.now() - lastMaintenanceDate) / (1000 * 60 * 60 * 24 * 30)
      );
      const remainingMonths = rule.everyMonths - monthsSinceLastMaintenance;

      if (remainingMonths <= 1 && remainingMonths > 0) {
        alert = {
          maintenanceType: rule.type,
          alertType: 'time',
          severity: 'medium',
          remainingMonths,
          message: `${rule.type} maintenance needed in ${remainingMonths} month(s)`
        };
      } else if (remainingMonths <= 0) {
        alert = {
          maintenanceType: rule.type,
          alertType: 'time',
          severity: 'critical',
          overdue: true,
          overdueMonths: Math.abs(remainingMonths),
          message: `${rule.type} maintenance is overdue by ${Math.abs(remainingMonths)} month(s)!`
        };
      }
    }

    if (alert) {
      alerts.push(alert);
    }
  }

  return successResponse(res, 200, "Maintenance alerts fetched successfully", {
    hasActiveTrip: true,
    truck: {
      _id: truck._id,
      registrationNumber: truck.registrationNumber,
      brand: truck.brand,
      model: truck.model,
      currentKm: truck.currentKm
    },
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
    alerts: alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    })
  });
});