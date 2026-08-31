import { createApp } from "./app";
import { testConnection, sequelize } from "./config/database";
import "./models";

const app = createApp();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await testConnection();

    // force: false → crea tablas que no existen, no modifica las existentes
    // Evita el error de Sequelize al intentar alterar FK constraints en PostgreSQL
    await sequelize.sync({ force: false });

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log(`Documentación: http://localhost:${PORT}/api/docs`);
    });
};

startServer();