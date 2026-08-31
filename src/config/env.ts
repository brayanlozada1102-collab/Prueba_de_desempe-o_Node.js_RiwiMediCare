import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "PORT",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
];

const validateEnv = (): void => {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Faltan variables de entorno requeridas: ${missing.join(", ")}. Revisa tu archivo .env`
        );
    }
};

validateEnv();

export const env = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    db: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        name: process.env.DB_NAME || "riwi_base_db",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
    },
    jwt: {
        secret: process.env.JWT_SECRET || "dev_secret_change_me",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
};