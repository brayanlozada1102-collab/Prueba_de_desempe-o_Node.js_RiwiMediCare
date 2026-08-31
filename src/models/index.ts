import { sequelize } from "../config/database";
import { User } from "./user.model";

export const db = {
    sequelize,
    User,
};

export default db;