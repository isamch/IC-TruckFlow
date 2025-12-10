import express from "express";
import {
  getMyMaintenanceLogs,
  getMyMaintenanceLogById,
  addMaintenanceLog,
  updateMyMaintenanceLog,
  deleteMyMaintenanceLog
} from "../../../controllers/driver/maintenance.controller.js";

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
router.use(authorize('driver'));

// Routes
router.get("/", getMyMaintenanceLogs);

router.get("/:id", validate({ params: maintenanceLogIdValidation }), getMyMaintenanceLogById);

router.post("/", validate({ body: createMaintenanceLogValidation }), addMaintenanceLog);

router.put("/:id", validate({ params: maintenanceLogIdValidation, body: updateMaintenanceLogValidation }), updateMyMaintenanceLog);

router.delete("/:id", validate({ params: maintenanceLogIdValidation }), deleteMyMaintenanceLog);

export default router;