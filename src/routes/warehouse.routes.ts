import { Router } from "express";
import * as ctrl from "../controllers/warehouse.controller";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware";

const router = Router();

// Get all warehouses (Authenticated)
router.get("/", verifyToken, ctrl.getAll);

// Get warehouse by ID (Authenticated)
router.get("/:id", verifyToken, ctrl.getById);

// Create warehouse (Admin only)
router.post("/", verifyToken, verifyAdmin, ctrl.create);

// Update warehouse (Admin only)
router.put("/:id", verifyToken, verifyAdmin, ctrl.update);

// Delete warehouse (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, ctrl.remove);

export default router;
