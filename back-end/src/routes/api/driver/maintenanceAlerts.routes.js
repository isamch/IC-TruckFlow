import express from "express";
import { getMyTruckAlerts } from "../../../controllers/driver/maintenanceAlerts.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('driver'));

// Routes
router.get("/", getMyTruckAlerts);

export default router;