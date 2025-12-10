import express from "express";
import {
  getAllTrailers,
  getTrailerById,
  createTrailer,
  updateTrailer,
  deleteTrailer,
  updateTrailerStatus
} from "../../../controllers/admin/trailer.controller.js";

import validate from "../../../middleware/validator.middleware.js";
import {
  createTrailerValidation,
  updateTrailerValidation,
  trailerIdValidation,
  updateTrailerStatusValidation
} from "../../../validations/trailer.validation.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";
// import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// Middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get("/", getAllTrailers);

router.get("/:id", validate({ params: trailerIdValidation }), getTrailerById);

router.post("/", validate({ body: createTrailerValidation }), createTrailer);

router.put("/:id", validate({ params: trailerIdValidation, body: updateTrailerValidation }), updateTrailer);

router.delete("/:id", validate({ params: trailerIdValidation }), deleteTrailer);

// Update trailer status
router.patch("/:id/status", validate({ params: trailerIdValidation, body: updateTrailerStatusValidation }), updateTrailerStatus);

export default router;