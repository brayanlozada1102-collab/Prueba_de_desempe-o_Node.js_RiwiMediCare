import * as userRepository from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "gestor";
}

interface LoginInput {
    email: string;
    password: string;
}

/**
 * Registra un nuevo usuario en la base de datos (Admin o Gestor).
 * Encripta la contraseña de forma segura usando bcrypt.
 * @param {RegisterInput} data Entidad con los datos del usuario a crear.
 * @returns {Promise<Partial<User>>} Promesa con la respuesta del usuario (sin password).
 * @throws {Error} Si el correo electrónico ya se encuentra reservado.
 */
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

/**
 * Autentica un usuario en el sistema.
 * @param {LoginInput} data Credenciales del usuario (email y contraseña).
 * @returns {Promise<{token: string, user: Partial<User>}>} Objeto con el Access Token JWT y la data del usuario logueado.
 * @throws {Error} Cuando el correo o la contraseña son incorrectos.
 */
export const login = async (data: LoginInput) => {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
        throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
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