import express from "express";
import {
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog
} from "../../../controllers/admin/maintenance.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createMaintenanceLogValidation,
  updateMaintenanceLogValidation,
  maintenanceLogIdValidation
} from "../../../validations/maintenanceLog.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getAllMaintenanceLogs);

router.get("/:id", validate({ params: maintenanceLogIdValidation }), getMaintenanceLogById);

router.post("/", validate({ body: createMaintenanceLogValidation }), createMaintenanceLog);

router.put("/:id", validate({ params: maintenanceLogIdValidation, body: updateMaintenanceLogValidation }), updateMaintenanceLog);

router.delete("/:id", validate({ params: maintenanceLogIdValidation }), deleteMaintenanceLog);

export default router;