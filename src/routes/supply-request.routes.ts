import { Router } from "express";
import * as ctrl from "../controllers/supply-request.controller";
import { verifyToken, verifyAdmin, AuthRequest } from "../middlewares/jwt.middleware";

const router = Router();

// Active supply requests (Authenticated)
router.get("/active", verifyToken, (req, res) => ctrl.getActive(req as AuthRequest, res));

// Create supply request (Manager/Gestor)
router.post("/", verifyToken, (req, res) => ctrl.create(req as AuthRequest, res));

// My supply requests (Manager/Gestor)
router.get("/my", verifyToken, (req, res) => ctrl.getMy(req as AuthRequest, res));

// All supply requests (Admin only)
router.get("/", verifyToken, verifyAdmin, (req, res) => ctrl.getAll(req as AuthRequest, res));

// Supply request details (Authenticated)
router.get("/:id", verifyToken, (req, res) => ctrl.getById(req as AuthRequest, res));

// Assign distribution warehouse (Admin only)
router.patch("/:id/assign", verifyToken, verifyAdmin, (req, res) =>
    ctrl.assignWarehouse(req as AuthRequest, res)
);

// Update status (Admin only)
router.patch("/:id/status", verifyToken, verifyAdmin, (req, res) =>
    ctrl.updateStatus(req as AuthRequest, res)
);

export default router;
