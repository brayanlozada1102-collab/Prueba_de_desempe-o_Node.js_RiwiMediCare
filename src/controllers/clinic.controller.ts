import { Request, Response } from "express";
import * as service from "../services/clinic.service";

export const getAll = async (_req: Request, res: Response) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const data = await service.getById(Number(req.params.id));
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(404).json({ success: false, message });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const data = await service.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        await service.update(Number(req.params.id), req.body);
        res.json({ success: true, message: "Clínica actualizada" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await service.remove(Number(req.params.id));
        res.json({ success: true, message: "Clínica eliminada" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};
