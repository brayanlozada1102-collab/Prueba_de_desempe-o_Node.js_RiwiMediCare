import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/jwt.middleware";
import { AuthRequest } from "../middlewares/jwt.middleware";

const router = Router();

// Rutas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);

// Ruta protegida: información del usuario autenticado
router.get("/me", verifyToken, (req, res) => authController.me(req as AuthRequest, res));

export default router;