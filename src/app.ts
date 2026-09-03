import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import clinicRoutes from "./routes/clinic.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import medicationRoutes from "./routes/medication.routes";
import supplyRequestRoutes from "./routes/supply-request.routes";
import seederRoutes from "./routes/seeder.routes";
import { verifyToken, AuthRequest } from "./middlewares/jwt.middleware";
import * as supplyRequestController from "./controllers/supply-request.controller";

export const createApp = (): Application => {
    const app = express();

    app.use(express.json());

    // ── Health Check ──────────────────────────────────────────────────────────
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", uptime: process.uptime() });
    });

    // ── Swagger API Documentation ─────────────────────────────────────────────
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "RiwiMediCare API Docs",
    }));

    // ── Authentication (Public) ───────────────────────────────────────────────
    app.use("/api/auth", authRoutes);

    // ── Clinics ───────────────────────────────────────────────────────────────
    app.use("/api/clinics", clinicRoutes);

    // Clinic supply request history
    app.get(
        "/api/clinics/:clinicId/requests",
        verifyToken,
        (req, res) => supplyRequestController.getByClinic(req as AuthRequest, res)
    );

    // ── Warehouses ────────────────────────────────────────────────────────────
    app.use("/api/warehouses", warehouseRoutes);

    // ── Medications ───────────────────────────────────────────────────────────
    app.use("/api/medications", medicationRoutes);

    // ── Supply Requests ───────────────────────────────────────────────────────
    app.use("/api/requests", supplyRequestRoutes);

    // ── Seeder (Admin) ────────────────────────────────────────────────────────
    app.use("/api/seed", seederRoutes);

    return app;
};