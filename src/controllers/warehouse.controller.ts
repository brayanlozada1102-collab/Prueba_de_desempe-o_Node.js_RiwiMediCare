import { Request, Response } from "express";
import * as service from "../services/warehouse.service";

/**
 * Retrieves all warehouse records.
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
 * Retrieves a warehouse by its ID.
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
 * Creates a new warehouse record.
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
 * Updates a warehouse partially.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const update = async (req: Request, res: Response) => {
    try {
        await service.update(Number(req.params.id), req.body);
        res.json({ success: true, message: "Warehouse updated successfully" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

/**
 * Deletes a warehouse from the system.
 * @param {Request} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const remove = async (req: Request, res: Response) => {
    try {
        await service.remove(Number(req.params.id));
        res.json({ success: true, message: "Warehouse deleted successfully" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};
