import express from "express";
import { getMaintenanceAlerts } from "../../../controllers/admin/maintenanceAlerts.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getMaintenanceAlerts);

export default router;