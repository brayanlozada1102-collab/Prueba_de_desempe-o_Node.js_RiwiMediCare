import { Response } from "express";
import * as service from "../services/supply-request.service";
import { AuthRequest } from "../middlewares/jwt.middleware";
import { RequestStatus } from "../models/supply-request.model";

export const getAll = async (_req: AuthRequest, res: Response) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

export const getMy = async (req: AuthRequest, res: Response) => {
    try {
        const data = await service.getByUser(req.user!.id);
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

export const getByClinic = async (req: AuthRequest, res: Response) => {
    try {
        const data = await service.getByClinic(Number(req.params.clinicId));
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

export const getById = async (req: AuthRequest, res: Response) => {
    try {
        const data = await service.getById(Number(req.params.id));
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(404).json({ success: false, message });
    }
};

export const create = async (req: AuthRequest, res: Response) => {
    try {
        const data = await service.create({
            ...req.body,
            requested_by: req.user!.id,
        });
        res.status(201).json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

export const assignWarehouse = async (req: AuthRequest, res: Response) => {
    try {
        await service.assignWarehouse(Number(req.params.id), req.body.warehouse_id);
        res.json({ success: true, message: "Almacén asignado correctamente" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    try {
        await service.updateStatus(Number(req.params.id), req.body.status as RequestStatus);
        res.json({ success: true, message: "Estado actualizado correctamente" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};
