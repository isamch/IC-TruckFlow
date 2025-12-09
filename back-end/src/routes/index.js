import express from 'express';
import authRoutes from './api/auth.routes.js';
import userRoutes from './api/admin/user.routes.js';
import truckRoutes from './api/admin/truck.routes.js';

const router = express.Router();

//  auth routes
router.use("/auth", authRoutes);


// admin routes
router.use("/admin/users", userRoutes);
router.use("/admin/trucks", truckRoutes);





export default router;