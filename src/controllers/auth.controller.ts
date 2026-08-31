import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        res.status(400).json({ success: false, message });
    }
};