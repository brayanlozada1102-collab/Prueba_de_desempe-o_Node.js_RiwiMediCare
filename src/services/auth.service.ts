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
 * Registers a new user in the database (Admin or Manager/Gestor).
 * Securely hashes the password using bcrypt with 10 salt rounds.
 * @param {RegisterInput} data User data payload.
 * @returns {Promise<Partial<User>>} User response object without password.
 * @throws {Error} If the email is already registered.
 */
export const register = async (data: RegisterInput) => {
    const existing = await userRepository.findByEmail(data.email);

    if (existing) {
        throw new Error("A user with that email already exists");
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
 * Authenticates a user and generates a signed JWT token.
 * @param {LoginInput} data User login credentials (email and password).
 * @returns {Promise<{token: string, user: Partial<User>}>} Object containing JWT token and user info.
 * @throws {Error} If credentials do not match.
 */
export const login = async (data: LoginInput) => {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
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