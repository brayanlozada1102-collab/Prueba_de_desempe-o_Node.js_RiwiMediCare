import { Router } from "express";
import { seed, upload } from "../controllers/seeder.controller";
import { verifyToken, verifyAdmin, AuthRequest } from "../middlewares/jwt.middleware";

const router = Router();

/**
 * POST /api/seed/:entity
 * Supported entities: users | clinics | warehouses | medications
 * Body: multipart/form-data with "file" field containing a JSON file
 * Requires: Admin JWT token
 */
router.post(
    "/:entity",
    verifyToken,
    verifyAdmin,
    upload.single("file"),
    (req, res) => seed(req as AuthRequest, res)
);

export default router;
