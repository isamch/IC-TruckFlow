import express from "express";
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
} from "../../../controllers/admin/trip.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createTripValidation,
  updateTripValidation,
  tripIdValidation
} from "../../../validations/trip.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getAllTrips);

router.get("/:id", validate({ params: tripIdValidation }), getTripById);

router.post("/", validate({ body: createTripValidation }), createTrip);

router.put("/:id", validate({ params: tripIdValidation, body: updateTripValidation }), updateTrip);

router.delete("/:id", validate({ params: tripIdValidation }), deleteTrip);

export default router;