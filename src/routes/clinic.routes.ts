import { Router } from "express";
import * as ctrl from "../controllers/clinic.controller";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware";

const router = Router();

router.get("/", verifyToken, ctrl.getAll);
router.get("/:id", verifyToken, ctrl.getById);
router.post("/", verifyToken, verifyAdmin, ctrl.create);
router.put("/:id", verifyToken, verifyAdmin, ctrl.update);
router.delete("/:id", verifyToken, verifyAdmin, ctrl.remove);

export default router;
