import express from "express";
import { login, logout, getMe, refresh } from "../../controllers/auth.controller.js";
import validate from "../../middleware/validator.middleware.js";
import { loginValidation } from "../../validations/auth.validation.js";
import { protect } from "../../middleware/auth.middleware.js";


const router = express.Router();

// Public Routes
router.post("/login", validate(loginValidation), login);
router.post("/refresh", refresh);

// Protected Routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;