import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import clinicRoutes from "./routes/clinic.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import medicationRoutes from "./routes/medication.routes";
import supplyRequestRoutes from "./routes/supply-request.routes";
import seederRoutes from "./routes/seeder.routes";
import { verifyToken, verifyAdmin, AuthRequest } from "./middlewares/jwt.middleware";
import * as supplyRequestController from "./controllers/supply-request.controller";

export const createApp = (): Application => {
    const app = express();

    app.use(express.json());

    // ── Health check ─────────────────────────────────────────────────────────
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", uptime: process.uptime() });
    });

    // ── Documentación Swagger ─────────────────────────────────────────────────
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "RiwiMediCare API Docs",
    }));

    // ── Auth (públicas) ───────────────────────────────────────────────────────
    app.use("/api/auth", authRoutes);

    // ── Clínicas ──────────────────────────────────────────────────────────────
    app.use("/api/clinics", clinicRoutes);

    // Historial de solicitudes por clínica
    app.get(
        "/api/clinics/:clinicId/requests",
        verifyToken,
        (req, res) => supplyRequestController.getByClinic(req as AuthRequest, res)
    );

    // ── Almacenes ─────────────────────────────────────────────────────────────
    app.use("/api/warehouses", warehouseRoutes);

    // ── Medicamentos ──────────────────────────────────────────────────────────
    app.use("/api/medications", medicationRoutes);

    // ── Solicitudes de abastecimiento ─────────────────────────────────────────
    app.use("/api/requests", supplyRequestRoutes);

    // ── Seeder (Admin) ────────────────────────────────────────────────────────
    app.use("/api/seed", seederRoutes);

    return app;
};