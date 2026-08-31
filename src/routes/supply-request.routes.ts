import { Router, Request, Response } from "express";
import * as ctrl from "../controllers/supply-request.controller";
import { verifyToken, verifyAdmin, AuthRequest } from "../middlewares/jwt.middleware";

const router = Router();

// Todos: solicitudes activas
router.get("/active", verifyToken, (req, res) => ctrl.getActive(req as AuthRequest, res));

// Gestor: crea solicitud
router.post("/", verifyToken, (req, res) => ctrl.create(req as AuthRequest, res));

// Gestor: mis solicitudes
router.get("/my", verifyToken, (req, res) => ctrl.getMy(req as AuthRequest, res));

// Admin: todas las solicitudes
router.get("/", verifyToken, verifyAdmin, (req, res) => ctrl.getAll(req as AuthRequest, res));

// Admin/Gestor: detalle de una solicitud
router.get("/:id", verifyToken, (req, res) => ctrl.getById(req as AuthRequest, res));

// Admin: asignar almacén
router.patch("/:id/assign", verifyToken, verifyAdmin, (req, res) =>
    ctrl.assignWarehouse(req as AuthRequest, res)
);

// Admin: cambiar estado
router.patch("/:id/status", verifyToken, verifyAdmin, (req, res) =>
    ctrl.updateStatus(req as AuthRequest, res)
);

export default router;
