import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: number;
    email: string;
    role: "admin" | "user";
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Token requerido" });
        return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ success: false, message: "JWT_SECRET no configurado" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ success: false, message: "Token inválido o expirado" });
    }
};

export const verifyAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ success: false, message: "Acceso denegado: se requiere rol admin" });
        return;
    }
    next();
};
