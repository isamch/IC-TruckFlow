import express from "express";
import {
  getAllTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
  updateTruckStatus,
  addTireToTruck,
  removeTireFromTruck
} from "../../../controllers/admin/truck.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createTruckValidation,
  updateTruckValidation,
  truckIdValidation,
  updateTruckStatusValidation,
  addTireValidation,
  removeTireValidation
} from "../../../validations/truck.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();


// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getAllTrucks);

router.get("/:id", validate({ params: truckIdValidation }), getTruckById);

router.post("/", validate({ body: createTruckValidation }), createTruck);

router.put("/:id", validate({ params: truckIdValidation, body: updateTruckValidation }), updateTruck);

router.delete("/:id", validate({ params: truckIdValidation }), deleteTruck);


// Update truck status
router.patch("/:id/status", validate({ params: truckIdValidation, body: updateTruckStatusValidation }), updateTruckStatus);

// Add tire to truck
router.patch("/:id/add-tire", validate({ params: truckIdValidation, body: addTireValidation }), addTireToTruck);

// Remove tire from truck
router.patch("/:id/remove-tire", validate({ params: truckIdValidation, body: removeTireValidation }), removeTireFromTruck);



export default router;
