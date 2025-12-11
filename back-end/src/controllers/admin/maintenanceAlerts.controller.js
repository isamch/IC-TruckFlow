import Truck from "../../models/truck.model.js";
import MaintenanceRules from "../../models/maintenanceRules.model.js";
import MaintenanceLog from "../../models/maintenanceLog.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import * as ApiError from "../../utils/apiError.js";
import dayjs from "dayjs";

/**
 * @desc    Get trucks that need maintenance soon
 * @route   GET /api/v1/admin/maintenance-alerts
 * @access  Private/Admin
 */
export const getMaintenanceAlerts = asyncHandler(async (req, res, next) => {
  const alerts = [];

  // get all rules
  const rules = await MaintenanceRules.find();

  // get all trucks
  const trucks = await Truck.find();

  for (const t of trucks) {
    for (const rule of rules) {
      // get last maintenance for this type once for each rule
      const lastMaintenance = await MaintenanceLog.findOne({
        truck: t._id,
        type: rule.type
      }).sort({ date: -1 });

      // ====== km-based maintenance ======
      if (rule.everyKm) {
        const lastMaintenanceKm = lastMaintenance ? lastMaintenance.km : 0;
        const kmSinceLastMaintenance = t.currentKm - lastMaintenanceKm;
        const remainingKm = rule.everyKm - kmSinceLastMaintenance;

        if (remainingKm <= 1000 && remainingKm > 0) {
          alerts.push({
            type: 'km',
            truck: {
              _id: t._id,
              registrationNumber: t.registrationNumber,
              brand: t.brand,
              model: t.model,
              currentKm: t.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'km',
            remainingKm,
            message: `${t.registrationNumber} needs ${rule.type} maintenance in ${remainingKm} km`
          });
        } else if (remainingKm <= 0) {
          alerts.push({
            type: 'km',
            truck: {
              _id: t._id,
              registrationNumber: t.registrationNumber,
              brand: t.brand,
              model: t.model,
              currentKm: t.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'km',
            overdue: true,
            overdueKm: Math.abs(remainingKm),
            message: `${t.registrationNumber} ${rule.type} maintenance is overdue by ${Math.abs(remainingKm)} km`
          });
        }
      }

      // ====== time-based maintenance ======
      if (rule.everyMonths) {
        const lastDate = lastMaintenance ? lastMaintenance.date : t.createdAt;
        const monthsSinceLastMaintenance = dayjs().diff(dayjs(lastDate), 'month');
        const remainingMonths = rule.everyMonths - monthsSinceLastMaintenance;

        if (remainingMonths <= 1 && remainingMonths > 0) {
          alerts.push({
            type: 'time',
            truck: {
              _id: t._id,
              registrationNumber: t.registrationNumber,
              brand: t.brand,
              model: t.model,
              currentKm: t.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'time',
            remainingMonths,
            message: `${t.registrationNumber} needs ${rule.type} maintenance in ${remainingMonths} month(s)`
          });
        } else if (remainingMonths <= 0) {
          alerts.push({
            type: 'time',
            truck: {
              _id: t._id,
              registrationNumber: t.registrationNumber,
              brand: t.brand,
              model: t.model,
              currentKm: t.currentKm
            },
            maintenanceType: rule.type,
            alertType: 'time',
            overdue: true,
            overdueMonths: Math.abs(remainingMonths),
            message: `${t.registrationNumber} ${rule.type} maintenance is overdue by ${Math.abs(remainingMonths)} month(s)`
          });
        }
      }
    }
  }

  return successResponse(res, 200, "Maintenance alerts fetched successfully", {
    totalAlerts: alerts.length,
    alerts
  });
});
