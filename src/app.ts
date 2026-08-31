import express, { Application } from "express";

export const createApp = (): Application => {
    const app = express();

    // Middleware para poder leer JSON en el body de las peticiones
    app.use(express.json());

    // Ruta de salud: sirve para confirmar que el server está vivo
    app.get("/health", (req, res) => {
        res.json({ status: "ok", uptime: process.uptime() });
    });

    return app;
};