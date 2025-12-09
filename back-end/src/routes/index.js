import express from 'express';
import authRoutes from './api/auth.routes.js';
import userRoutes from './api/admin/user.routes.js';

const router = express.Router();

//  auth routes
router.use("/auth", authRoutes);


// admin routes
router.use("/admin/users", userRoutes);





export default router;