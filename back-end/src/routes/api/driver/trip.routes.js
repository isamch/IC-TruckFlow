import express from "express";
import {
  getMyTrips,
  getMyTripById,
  startTrip,
  finishTrip,
  updateTripNotes
} from "../../../controllers/driver/trip.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  tripIdValidation,
  startTripValidation,
  finishTripValidation,
  updateNotesValidation
} from "../../../validations/trip.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('driver'));

// Routes
router.get("/", getMyTrips);

router.get("/:id", validate({ params: tripIdValidation }), getMyTripById);

// Start trip
router.patch("/:id/start", validate({ params: tripIdValidation, body: startTripValidation }), startTrip);

// Finish trip
router.patch("/:id/finish", validate({ params: tripIdValidation, body: finishTripValidation }), finishTrip);

// Update notes
router.patch("/:id/update-notes", validate({ params: tripIdValidation, body: updateNotesValidation }), updateTripNotes);

export default router;