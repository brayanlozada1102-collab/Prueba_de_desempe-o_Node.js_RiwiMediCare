import { createApp } from "./app";
import { testConnection, sequelize } from "./config/database";
import "./models";

const app = createApp();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await testConnection();

    // force: false → creates tables that do not exist, does not alter existing ones
    // Avoids Sequelize errors when attempting to alter FK constraints in PostgreSQL
    await sequelize.sync({ force: false });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
    });
};

startServer();