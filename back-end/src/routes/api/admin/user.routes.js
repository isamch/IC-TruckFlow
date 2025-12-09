import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, toggleUserActiveStatus } from "../../../controllers/admin/user.controller.js";
import validate from "../../../middleware/validator.middleware.js";
import { createUserValidation, updateUserValidation, userIdValidation } from "../../../validations/user.validation.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

const router = express.Router();

// middleware
router.use(protect);
router.use(authorize('admin'));

// routes
router.get("/", getAllUsers);
router.get("/:id", validate({ 'params': userIdValidation }), getUserById);

router.post("/", validate({ 'body': createUserValidation }), createUser);

router.put("/:id", validate({ 'params': userIdValidation }), validate({ 'body': updateUserValidation }), updateUser);

router.delete("/:id", validate({ 'params': userIdValidation }), deleteUser);

router.patch("/:id/toggle-active", validate({ 'params': userIdValidation }), toggleUserActiveStatus);

export default router;