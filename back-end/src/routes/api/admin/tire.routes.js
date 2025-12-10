import express from "express";
import {
  getAllTires,
  getTireById,
  createTire,
  updateTire,
  deleteTire,
  changeTirePosition,
  updateTireCondition,
  assignTireToTruck
} from "../../../controllers/admin/tire.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createTireValidation,
  updateTireValidation,
  tireIdValidation,
  changePositionValidation,
  updateConditionValidation,
  assignTruckValidation
} from "../../../validations/tire.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getAllTires);

router.get("/:id", validate({ params: tireIdValidation }), getTireById);

router.post("/", validate({ body: createTireValidation }), createTire);

router.put("/:id", validate({ params: tireIdValidation, body: updateTireValidation }), updateTire);

router.delete("/:id", validate({ params: tireIdValidation }), deleteTire);

// Change tire position
router.patch("/:id/change-position", validate({ params: tireIdValidation, body: changePositionValidation }), changeTirePosition);

// Update tire condition
router.patch("/:id/update-condition", validate({ params: tireIdValidation, body: updateConditionValidation }), updateTireCondition);

// Assign tire to truck
router.patch("/:id/assign-truck", validate({ params: tireIdValidation, body: assignTruckValidation }), assignTireToTruck);

export default router;