import { Response } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middlewares/jwt.middleware";
import { User } from "../models/user.model";
import { Clinic } from "../models/clinic.model";
import { Warehouse } from "../models/warehouse.model";
import { Medication } from "../models/medication.model";

// Multer: almacena el archivo en memoria como Buffer
export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/json" || file.originalname.endsWith(".json")) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos JSON"));
        }
    },
});

type Entity = "users" | "clinics" | "warehouses" | "medications";

const seeders: Record<Entity, (records: any[]) => Promise<number>> = {
    users: async (records) => {
        let count = 0;
        for (const r of records) {
            const exists = await User.findOne({ where: { email: r.email } });
            if (!exists) {
                const hashed = await bcrypt.hash(r.password, 10);
                await User.create({ ...r, password: hashed });
                count++;
            }
        }
        return count;
    },
    clinics: async (records) => {
        let count = 0;
        for (const r of records) {
            const [, created] = await Clinic.findOrCreate({ where: { name: r.name }, defaults: r });
            if (created) count++;
        }
        return count;
    },
    warehouses: async (records) => {
        let count = 0;
        for (const r of records) {
            const [, created] = await Warehouse.findOrCreate({ where: { name: r.name }, defaults: r });
            if (created) count++;
        }
        return count;
    },
    medications: async (records) => {
        let count = 0;
        for (const r of records) {
            const [, created] = await Medication.findOrCreate({ where: { name: r.name }, defaults: r });
            if (created) count++;
        }
        return count;
    },
};

/**
 * Controlador masivo de seeder via FormData JSON.
 * @param {AuthRequest} req - Petición autorizada con params.entity y Multer File
 * @param {Response} res
 */
export const seed = async (req: AuthRequest, res: Response) => {
    try {
        const entity = req.params.entity as Entity;

        if (!Object.keys(seeders).includes(entity)) {
            res.status(400).json({
                success: false,
                message: `Entidad inválida. Use: ${Object.keys(seeders).join(", ")}`,
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({ success: false, message: "Archivo JSON requerido" });
            return;
        }

        let records: any[];
        try {
            records = JSON.parse(req.file.buffer.toString("utf-8"));
        } catch {
            res.status(400).json({ success: false, message: "El archivo no es un JSON válido" });
            return;
        }

        if (!Array.isArray(records)) {
            res.status(400).json({ success: false, message: "El JSON debe ser un array de objetos" });
            return;
        }

        const inserted = await seeders[entity](records);

        res.status(200).json({
            success: true,
            message: `Seeder ejecutado: ${inserted} registros insertados en "${entity}"`,
            total_received: records.length,
            inserted,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error en seeder";
        res.status(500).json({ success: false, message });
    }
};
