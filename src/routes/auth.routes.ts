import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { verifyToken, AuthRequest } from "../middlewares/jwt.middleware";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route: get current authenticated user profile
router.get("/me", verifyToken, (req, res) => authController.me(req as AuthRequest, res));

export default router;