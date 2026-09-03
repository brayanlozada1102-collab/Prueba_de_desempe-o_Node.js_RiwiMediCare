import { Router } from "express";
import * as ctrl from "../controllers/medication.controller";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware";

const router = Router();

// Get all medications (Authenticated)
router.get("/", verifyToken, ctrl.getAll);

// Get medication by ID (Authenticated)
router.get("/:id", verifyToken, ctrl.getById);

// Create medication (Admin only)
router.post("/", verifyToken, verifyAdmin, ctrl.create);

// Update medication (Admin only)
router.put("/:id", verifyToken, verifyAdmin, ctrl.update);

// Delete medication (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, ctrl.remove);

export default router;
