import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AuthRequest } from "../middlewares/jwt.middleware";

/**
 * Controlador de registro de usuarios.
 * @param {Request} req
 * @param {Response} res
 */
export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        res.status(400).json({ success: false, message });
    }
};

/**
 * Controlador de inicio de sesión.
 * @param {Request} req
 * @param {Response} res
 */
export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        res.status(401).json({ success: false, message });
    }
};

/**
 * Controlador para obtener perfil personal protegido.
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const me = async (req: AuthRequest, res: Response) => {
    res.status(200).json({ success: true, user: req.user });
};