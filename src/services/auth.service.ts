import * as userRepository from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const register = async (data: RegisterInput) => {
    const existing = await userRepository.findByEmail(data.email);

    if (existing) {
        throw new Error("Ya existe un usuario con ese correo");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser({
        ...data,
        password: hashedPassword,
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

export const login = async (data: LoginInput) => {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
        throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new Error("Credenciales inválidas");
    }

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

    if (!secret) {
        throw new Error("JWT_SECRET no configurado en variables de entorno");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn } as jwt.SignOptions
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};