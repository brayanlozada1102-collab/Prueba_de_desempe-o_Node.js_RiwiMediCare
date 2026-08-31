import * as userRepository from "../repositories/user.repository";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export const register = async (data: RegisterInput) => {
    const existing = await userRepository.findByEmail(data.email);

    if (existing) {
        throw new Error("Ya existe un usuario con ese correo");
    }

    const user = await userRepository.createUser(data);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};