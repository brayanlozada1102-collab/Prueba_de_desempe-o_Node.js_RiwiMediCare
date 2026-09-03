import { Router } from "express";
import * as ctrl from "../controllers/clinic.controller";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware";

const router = Router();

// Get all clinics (Authenticated)
router.get("/", verifyToken, ctrl.getAll);

// Get clinic by ID (Authenticated)
router.get("/:id", verifyToken, ctrl.getById);

// Create clinic (Admin only)
router.post("/", verifyToken, verifyAdmin, ctrl.create);

// Update clinic (Admin only)
router.put("/:id", verifyToken, verifyAdmin, ctrl.update);

// Delete clinic (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, ctrl.remove);

export default router;
