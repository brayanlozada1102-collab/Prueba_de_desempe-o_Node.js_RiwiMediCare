import { Response } from "express";
import * as service from "../services/supply-request.service";
import { AuthRequest } from "../middlewares/jwt.middleware";
import { RequestStatus } from "../models/supply-request.model";

/**
 * Retrieves all supply requests across the system (Admin only).
 * @param {AuthRequest} req - Express Request.
 * @param {Response} res - Express Response.
 */
export const getAll = async (_req: AuthRequest, res: Response) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

/**
 * Retrieves supply requests created by the current authenticated user (Manager/Gestor).
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const getMy = async (req: AuthRequest, res: Response) => {
    try {
        const data = await service.getByUser(req.user!.id);
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

/**
 * Retrieves supply requests for a specific clinic.
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const getByClinic = async (req: AuthRequest, res: Response) => {
    try {
        const data = await service.getByClinic(Number(req.params.clinicId));
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};

/**
 * Retrieves a supply request by its ID.
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const getById = async (req: AuthRequest, res: Response) => {
    try {
        const data = await service.getById(Number(req.params.id));
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(404).json({ success: false, message });
    }
};

/**
 * Creates a new supply request.
 * @param {AuthRequest} req
 * @param {Response} res
 */
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

/**
 * Assigns a distribution warehouse to a supply request (Admin).
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const assignWarehouse = async (req: AuthRequest, res: Response) => {
    try {
        await service.assignWarehouse(Number(req.params.id), req.body.warehouse_id);
        res.json({ success: true, message: "Warehouse successfully assigned" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

/**
 * Updates the lifecycle status of a supply request (Admin).
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const updateStatus = async (req: AuthRequest, res: Response) => {
    try {
        await service.updateStatus(Number(req.params.id), req.body.status as RequestStatus);
        res.json({ success: true, message: "Status successfully updated" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ success: false, message });
    }
};

/**
 * Retrieves all active supply requests (pending and approved).
 * @param {AuthRequest} _req
 * @param {Response} res 
 */
export const getActive = async (_req: AuthRequest, res: Response) => {
    try {
        const data = await service.getActive();
        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ success: false, message });
    }
};
