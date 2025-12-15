import Trip from "../../models/trip.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { calculateTruckMaintenanceAlerts } from "../../utils/maintenanceHelper.js";


/**
 * @desc    Get maintenance alerts for driver's assigned trucks
 * @route   GET /api/v1/driver/my-truck-alerts
 * @access  Private/Driver
 */
export const getMyTruckAlerts = asyncHandler(async (req, res, next) => {
  // Get driver's assigned trips (to_do or in_progress)
  const assignedTrips = await Trip.find({
    driver: req.user.userId,
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

  // Get unique trucks from trips
  function getUniqueTrucks(trips) {
    const uniqueTrucks = {};
    trips.forEach(trip => {
      uniqueTrucks[trip.truck._id] = trip.truck;
    });
    return Object.values(uniqueTrucks);
  }

  const uniqueTrucksMap = getUniqueTrucks(assignedTrips);


  const allAlerts = [];

  // Calculate alerts for each unique truck using helper function
  for (const truckDoc of uniqueTrucksMap) {
    const maintenanceData = await calculateTruckMaintenanceAlerts(truckDoc);

    // Only add trucks that have alerts
    if (maintenanceData.totalAlerts > 0) {
      // Add each alert with truck info
      maintenanceData.alerts.forEach(alert => {
        allAlerts.push({
          ...alert,
          truck: {
            _id: truckDoc._id.toString(),
            registrationNumber: truckDoc.registrationNumber,
            brand: truckDoc.brand,
            model: truckDoc.model,
            currentKm: truckDoc.currentKm,
            status: truckDoc.status
          }
        });
      });
    }
  }



  return successResponse(res, 200, "Maintenance alerts fetched successfully", {
    hasAssignedTrip: true,
    totalAlerts: allAlerts.length,
    alerts: allAlerts
  });
});