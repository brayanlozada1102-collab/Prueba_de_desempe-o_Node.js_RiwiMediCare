import { createApp } from "./app";
import { testConnection } from "./config/database";

const app = createApp();
const PORT = 3000;

const startServer = async () => {
    await testConnection();

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
};

startServer();