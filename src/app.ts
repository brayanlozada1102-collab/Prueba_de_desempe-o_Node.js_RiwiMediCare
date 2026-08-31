import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
// import { swaggerSpec } from "./config/swagger";
import authRoutes from "./routes/auth.routes";


export const createApp = (): Application => {
    const app = express();

    app.use(express.json());

    app.use("/api/auth", authRoutes);

    app.get("/health", (req, res) => {
        res.json({ status: "ok", uptime: process.uptime() });
    });

    // // Swagger va aquí, junto a las demás rutas
    // app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // // Rutas reales de la API
    // app.use("/api", apiRoutes);

    return app;
};