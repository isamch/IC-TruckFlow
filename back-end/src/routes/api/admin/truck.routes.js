import express from "express";
import { getAllTrucks, getTruckById, createTruck, updateTruck, deleteTruck, toggleTruckActiveStatus } from "../../../controllers/admin/truck.controller.js";
import validate from "../../../middleware/validator.middleware.js";
import { createTruckValidation, updateTruckValidation, truckIdValidation } from "../../../validations/truck.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";


const router = express.Router();


// middleware
router.use(protect);
router.use(authorize('admin'));

// routes
router.get("/", getAllTrucks);
router.get("/:id", validate({ 'params': truckIdValidation }), getTruckById);

router.post("/", validate({ 'body': createTruckValidation }), createTruck);

router.put("/:id", validate({ 'params': truckIdValidation }), validate({ 'body': updateTruckValidation }), updateTruck);

router.delete("/:id", validate({ 'params': truckIdValidation }), deleteTruck);

router.patch("/:id/toggle-active", validate({ 'params': truckIdValidation }), toggleTruckActiveStatus);

export default router;