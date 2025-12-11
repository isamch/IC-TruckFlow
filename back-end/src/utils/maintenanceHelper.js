import MaintenanceRules from "../models/maintenanceRules.model.js";
import MaintenanceLog from "../models/maintenanceLog.model.js";
import dayjs from "dayjs";



/**
 * @desc    Calculate maintenance alerts for a single truck
 * @param   {Object} truck - Truck document from database
 * @returns {Object} - { alerts: [], status: 'ok'|'warning'|'critical' }
 */
export const calculateTruckMaintenanceAlerts = async (truck) => {
  const alerts = [];

  // Get all maintenance rules
  const rules = await MaintenanceRules.find();

  for (const rule of rules) {
    let alert = null;

    // Get last maintenance for this type
    const lastMaintenance = await MaintenanceLog.findOne({
      truck: truck._id,
      type: rule.type
    }).sort({ date: -1 });

    // ====== Check km-based maintenance ======
    if (rule.everyKm) {
      const lastMaintenanceKm = lastMaintenance ? lastMaintenance.km : 0;
      const kmSinceLastMaintenance = truck.currentKm - lastMaintenanceKm;
      const remainingKm = rule.everyKm - kmSinceLastMaintenance;

      if (remainingKm <= 1000 && remainingKm > 0) {
        const severity = remainingKm <= 500 ? 'high' : 'medium';
        alert = {
          maintenanceType: rule.type,
          alertType: 'km',
          severity,
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

    // ====== Check time-based maintenance ======
    if (rule.everyMonths && !alert) {
      const lastDate = lastMaintenance ? lastMaintenance.date : truck.createdAt;
      const monthsSinceLastMaintenance = dayjs().diff(dayjs(lastDate), 'month');
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

  return {
    alerts,
    totalAlerts: alerts.length,
  };
};