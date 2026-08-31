import { User } from "../models/user.model";

export const findByEmail = async (email: string) => {
    return User.findOne({ where: { email } });
};

export const createUser = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    return User.create(data);
};