import express from "express";
import { login, logout, getMe, refreshAccessToken } from "../../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { loginValidation } from "../../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.js";


const router = express.Router();

// Public Routes
router.post("/login", validate(loginValidation), login);
router.post("/refresh", refreshAccessToken);

// Protected Routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;