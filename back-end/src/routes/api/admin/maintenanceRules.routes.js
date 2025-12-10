import express from "express";
import {
  getAllMaintenanceRules,
  getMaintenanceRuleById,
  createMaintenanceRule,
  updateMaintenanceRule,
  deleteMaintenanceRule
} from "../../../controllers/admin/maintenanceRules.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createMaintenanceRuleValidation,
  updateMaintenanceRuleValidation,
  maintenanceRuleIdValidation
} from "../../../validations/maintenanceRules.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getAllMaintenanceRules);

router.get("/:id", validate({ params: maintenanceRuleIdValidation }), getMaintenanceRuleById);

router.post("/", validate({ body: createMaintenanceRuleValidation }), createMaintenanceRule);

router.put("/:id", validate({ params: maintenanceRuleIdValidation, body: updateMaintenanceRuleValidation }), updateMaintenanceRule);

router.delete("/:id", validate({ params: maintenanceRuleIdValidation }), deleteMaintenanceRule);

export default router;