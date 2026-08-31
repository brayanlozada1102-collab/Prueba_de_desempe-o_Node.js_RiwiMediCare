import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize(
    env.db.name,
    env.db.user,
    env.db.password,
    {
        host: env.db.host,
        port: env.db.port,
        dialect: "postgres",
        logging: env.nodeEnv === "development" ? console.log : false,
    }
);

export const testConnection = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida correctamente.");
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
    }
};