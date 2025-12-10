import truck from "../../models/truck.model.js";
import maintenanceRules from "../../models/maintenanceRules.model.js";
import maintenanceLog from "../../models/maintenanceLog.model.js";
import trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";


/**
 * @desc    Get maintenance alerts for driver's assigned truck
 * @route   GET /api/v1/driver/my-truck-alerts
 * @access  Private/Driver
 */
export const getMyTruckAlerts = asyncHandler(async (req, res, next) => {
  // Get driver's next trip (to_do or in_progress)
  const assignedTrip = await trip.findOne({
    driver: req.user.id,
    status: { $in: ['to_do', 'in_progress'] }
  })
    .populate('truck')
    .sort({ plannedDate: 1 }); // Get the earliest trip

  if (!assignedTrip) {
    return successResponse(res, 200, "No assigned trip found", {
      hasAssignedTrip: false,
      tripStatus: null,
      alerts: []
    });
  }

  const truckDoc = assignedTrip.truck;
  const alerts = [];

  // Get all maintenance rules
  const rules = await maintenanceRules.find();

  for (const rule of rules) {
    let alert = null;

    // Check km-based maintenance
    if (rule.everyKm) {
      // Get last maintenance of this type for this truck
      const lastMaintenance = await maintenanceLog.findOne({
        truck: truckDoc._id,
        type: rule.type
      }).sort({ date: -1 });

      const lastMaintenanceKm = lastMaintenance ?
        (lastMaintenance.date ? truckDoc.currentKm - (truckDoc.currentKm - truckDoc.lastOilChangeKm || 0) : 0) : 0;

      const kmSinceLastMaintenance = truckDoc.currentKm - lastMaintenanceKm;
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
      const lastMaintenance = await maintenanceLog.findOne({
        truck: truckDoc._id,
        type: rule.type
      }).sort({ date: -1 });

      const lastMaintenanceDate = lastMaintenance ?
        new Date(lastMaintenance.date) : new Date(truckDoc.createdAt);
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

  // Sort alerts by severity
  const sortedAlerts = alerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return successResponse(res, 200, "Maintenance alerts fetched successfully", {
    hasAssignedTrip: true,
    tripStatus: assignedTrip.status,
    trip: {
      _id: assignedTrip._id,
      startLocation: assignedTrip.startLocation,
      endLocation: assignedTrip.endLocation,
      plannedDate: assignedTrip.plannedDate,
      status: assignedTrip.status
    },
    truck: {
      _id: truckDoc._id,
      registrationNumber: truckDoc.registrationNumber,
      brand: truckDoc.brand,
      model: truckDoc.model,
      currentKm: truckDoc.currentKm,
      status: truckDoc.status
    },
    totalAlerts: sortedAlerts.length,
    criticalAlerts: sortedAlerts.filter(a => a.severity === 'critical').length,
    highAlerts: sortedAlerts.filter(a => a.severity === 'high').length,
    canStartTrip: sortedAlerts.filter(a => a.severity === 'critical').length === 0,
    alerts: sortedAlerts
  });
});