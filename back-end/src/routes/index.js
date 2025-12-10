import express from 'express';
import authRoutes from './api/auth.routes.js';
import userRoutes from './api/admin/user.routes.js';
import truckRoutes from './api/admin/truck.routes.js';
import trailerRoutes from './api/admin/trailer.routes.js';
import tireRoutes from './api/admin/tire.routes.js';
import adminTripRoutes from './api/admin/trip.routes.js';
import driverTripRoutes from './api/driver/trip.routes.js';
import adminFuelLogRoutes from './api/admin/fuelLog.routes.js';
import driverFuelLogRoutes from './api/driver/fuelLog.routes.js';
import adminMaintenanceRoutes from './api/admin/maintenance.routes.js';
import driverMaintenanceRoutes from './api/driver/maintenance.routes.js';
import maintenanceRulesRoutes from './api/admin/maintenanceRules.routes.js';
import maintenanceAlertsRoutes from './api/admin/maintenanceAlerts.routes.js';



const router = express.Router();

//  auth routes
router.use("/auth", authRoutes);


// admin routes
router.use("/admin/users", userRoutes);
router.use("/admin/trucks", truckRoutes);
router.use("/admin/trailers", trailerRoutes);
router.use("/admin/tires", tireRoutes);
router.use("/admin/trips", adminTripRoutes);
router.use("/admin/fuel-logs", adminFuelLogRoutes);
router.use("/admin/maintenance-logs", adminMaintenanceRoutes);
router.use("/admin/maintenance-rules", maintenanceRulesRoutes);
router.use("/admin/maintenance-alerts", maintenanceAlertsRoutes);


// Driver routes
router.use("/driver/trips", driverTripRoutes);
router.use("/driver/fuel-logs", driverFuelLogRoutes);
router.use("/driver/maintenance-logs", driverMaintenanceRoutes);





export default router;