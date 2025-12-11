import truck from "../../models/truck.model.js";
import maintenanceRules from "../../models/maintenanceRules.model.js";
import maintenanceLog from "../../models/maintenanceLog.model.js";
import trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import dayjs from "dayjs";

/**
 * @desc    Get maintenance alerts for driver's assigned trucks
 * @route   GET /api/v1/driver/my-truck-alerts
 * @access  Private/Driver
 */
export const getMyTruckAlerts = asyncHandler(async (req, res, next) => {
  // Get driver's assigned trips
  const assignedTrips = await trip.find({
    driver: req.user.id,
    status: { $in: ['to_do', 'in_progress'] }
  })
    .populate('truck')
    .sort({ plannedDate: 1 });

  if (assignedTrips.length === 0) {
    return successResponse(res, 200, "No assigned trips found", {
      hasAssignedTrip: false,
      alerts: []
    });
  }

  // Create a map of unique trucks
  function getUniqueTrucks(trips) {
    const uniqueTrucks = {};
    trips.forEach(trip => {
      uniqueTrucks[trip.truck._id] = trip.truck;
    });
    return Object.values(uniqueTrucks);
  }

  const uniqueTrucksMap = getUniqueTrucks(assignedTrips);



  const alerts = [];

  // Get all maintenance rules
  const rules = await maintenanceRules.find();

  // Loop over each unique truck
  for (const truckDoc of uniqueTrucksMap) {
    for (const rule of rules) {
      let alert = null;

      // Maintenance by kilometers
      if (rule.everyKm) {
        const lastMaintenance = await maintenanceLog.findOne({
          truck: truckDoc._id,
          type: rule.type
        }).sort({ date: -1 });

        const lastMaintenanceKm = lastMaintenance ? lastMaintenance.km : 0;
        const kmSinceLastMaintenance = truckDoc.currentKm - lastMaintenanceKm;
        const remainingKm = rule.everyKm - kmSinceLastMaintenance;

        if (remainingKm <= 1000 && remainingKm > 0) {
          alert = {
            truckId: truckDoc._id,
            maintenanceType: rule.type,
            alertType: 'km',
            severity: remainingKm <= 500 ? 'high' : 'medium',
            remainingKm,
            message: `${rule.type} maintenance needed in ${remainingKm} km`
          };
        } else if (remainingKm <= 0) {
          alert = {
            truckId: truckDoc._id,
            maintenanceType: rule.type,
            alertType: 'km',
            severity: 'critical',
            overdue: true,
            overdueKm: Math.abs(remainingKm),
            message: `${rule.type} maintenance is overdue by ${Math.abs(remainingKm)} km!`
          };
        }
      }

      // Maintenance by months
      if (rule.everyMonths && !alert) {
        const lastMaintenance = await maintenanceLog.findOne({
          truck: truckDoc._id,
          type: rule.type
        }).sort({ date: -1 });

        const lastMaintenanceDate = lastMaintenance ? lastMaintenance.date : truckDoc.createdAt;
        const monthsSinceLastMaintenance = dayjs().diff(dayjs(lastMaintenanceDate), 'month');
        const remainingMonths = rule.everyMonths - monthsSinceLastMaintenance;

        if (remainingMonths <= 1 && remainingMonths > 0) {
          alert = {
            truckId: truckDoc._id,
            maintenanceType: rule.type,
            alertType: 'time',
            severity: 'medium',
            remainingMonths,
            message: `${rule.type} maintenance needed in ${remainingMonths} month(s)`
          };
        } else if (remainingMonths <= 0) {
          alert = {
            truckId: truckDoc._id,
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
        alerts.push({
          ...alert,
          truck: {
            _id: truckDoc._id,
            registrationNumber: truckDoc.registrationNumber,
            brand: truckDoc.brand,
            model: truckDoc.model,
            currentKm: truckDoc.currentKm,
            status: truckDoc.status
          }
        });
      }
    }
  }

  // Sort alerts by severity
  function sortAlertsBySeverity(alerts) {
    const critical = [];
    const high = [];
    const medium = [];

    for (const alert of alerts) {
      if (alert.severity === "critical") critical.push(alert);
      else if (alert.severity === "high") high.push(alert);
      else if (alert.severity === "medium") medium.push(alert);
    }

    return [...critical, ...high, ...medium];
  }

  const sortedAlerts = sortAlertsBySeverity(alerts);

  return successResponse(res, 200, "Maintenance alerts fetched successfully", {
    hasAssignedTrip: true,
    totalAlerts: sortedAlerts.length,
    alerts: sortedAlerts
  });
});
