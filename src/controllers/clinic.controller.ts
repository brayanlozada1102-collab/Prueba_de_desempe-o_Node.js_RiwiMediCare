import { Request, Response } from "express";
import * as service from "../services/clinic.service";

/**
 * Obtiene todos los registros de clínica.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const getAll = async (_req: Request, res: Response) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

/**
 * Consulta un(a) clínica por su ID.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const getById = async (req: Request, res: Response) => {
    try {
        const data = await service.getById(Number(req.params.id));
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(404).json({ success: false, message });
    }
};

/**
 * Crea un nuevo registro de clínica.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const create = async (req: Request, res: Response) => {
    try {
        const data = await service.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

/**
 * Actualiza parcialmente un(a) clínica.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const update = async (req: Request, res: Response) => {
    try {
        await service.update(Number(req.params.id), req.body);
        res.json({ success: true, message: "Clínica actualizada" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

/**
 * Elimina un(a) clínica del sistema.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const remove = async (req: Request, res: Response) => {
    try {
        await service.remove(Number(req.params.id));
        res.json({ success: true, message: "Clínica eliminada" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};
