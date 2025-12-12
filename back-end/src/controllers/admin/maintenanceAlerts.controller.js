import Truck from "../../models/truck.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { calculateTruckMaintenanceAlerts } from "../../utils/maintenanceHelper.js";



/**
 * @desc    Get trucks that need maintenance soon
 * @route   GET /api/v1/admin/maintenance-alerts
 * @access  Private/Admin
 */
export const getMaintenanceAlerts = asyncHandler(async (req, res, next) => {
  const allAlerts = [];

  // Get all trucks
  const trucks = await Truck.find();

  // Calculate alerts for each truck using helper function
  for (const truck of trucks) {
    const maintenanceData = await calculateTruckMaintenanceAlerts(truck);

    // Only add trucks that have alerts
    if (maintenanceData.totalAlerts > 0) {
      // Add each alert with truck info
      maintenanceData.alerts.forEach(alert => {
        allAlerts.push({
          ...alert,
          truck: {
            _id: Truck._id.toString(),
            registrationNumber: Truck.registrationNumber,
            brand: Truck.brand,
            model: Truck.model,
            currentKm: Truck.currentKm,
          }
        });
      });
    }
  }




  return successResponse(res, 200, "Maintenance alerts fetched successfully", {
    totalAlerts: allAlerts.length,
    alerts: allAlerts
  });
});