import { createApp } from "./app";
import { testConnection, sequelize } from "./config/database";
import "./models";

const app = createApp();
const PORT = 3000;

const startServer = async () => {
    await testConnection();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
};

startServer();