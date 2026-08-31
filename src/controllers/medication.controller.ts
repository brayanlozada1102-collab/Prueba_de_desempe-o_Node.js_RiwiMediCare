import { Request, Response } from "express";
import * as service from "../services/medication.service";

/**
 * Obtiene todos los registros de medicamento.
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
 * Consulta un(a) medicamento por su ID.
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
 * Crea un nuevo registro de medicamento.
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
 * Actualiza parcialmente un(a) medicamento.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const update = async (req: Request, res: Response) => {
    try {
        await service.update(Number(req.params.id), req.body);
        res.json({ success: true, message: "Medicamento actualizado" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

/**
 * Elimina un(a) medicamento del sistema.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const remove = async (req: Request, res: Response) => {
    try {
        await service.remove(Number(req.params.id));
        res.json({ success: true, message: "Medicamento eliminado" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};
