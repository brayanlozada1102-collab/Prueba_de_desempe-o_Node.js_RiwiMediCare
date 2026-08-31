import { Router } from "express";
import { seed, upload } from "../controllers/seeder.controller";
import { verifyToken, verifyAdmin, AuthRequest } from "../middlewares/jwt.middleware";

const router = Router();

/**
 * POST /api/seed/:entity
 * Entidades soportadas: users | clinics | warehouses | medications
 * Body: multipart/form-data con campo "file" conteniendo un archivo JSON
 * Requiere: admin token
 */
router.post(
    "/:entity",
    verifyToken,
    verifyAdmin,
    upload.single("file"),
    (req, res) => seed(req as AuthRequest, res)
);

export default router;
