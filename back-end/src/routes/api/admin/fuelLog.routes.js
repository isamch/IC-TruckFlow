import express from "express";
import {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog
} from "../../../controllers/admin/fuelLog.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createFuelLogValidation,
  updateFuelLogValidation,
  fuelLogIdValidation
} from "../../../validations/fuelLog.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getAllFuelLogs);

router.get("/:id", validate({ params: fuelLogIdValidation }), getFuelLogById);

router.post("/", validate({ body: createFuelLogValidation }), createFuelLog);

router.put("/:id", validate({ params: fuelLogIdValidation, body: updateFuelLogValidation }), updateFuelLog);

router.delete("/:id", validate({ params: fuelLogIdValidation }), deleteFuelLog);

export default router;