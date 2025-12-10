import express from "express";
import {
  getMyFuelLogs,
  getMyFuelLogById,
  addFuelLog
} from "../../../controllers/driver/fuelLog.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createFuelLogValidation,
  fuelLogIdValidation
} from "../../../validations/fuelLog.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('driver'));

// Routes
router.get("/", getMyFuelLogs);

router.get("/:id", validate({ params: fuelLogIdValidation }), getMyFuelLogById);

router.post("/", validate({ body: createFuelLogValidation }), addFuelLog);

export default router;