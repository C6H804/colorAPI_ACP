const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://127.0.0.1",
        "http://localhost",
        "http://193.252.183.142",
        "http://192.168.1.63",
        "https://acportail.fr",
        "null" // Pour les fichiers ouverts localement (file://)
        // insérer ici les adresses pour l'accés à l'API
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Configuration Swagger avec fichier YAML externe
const swaggerDocument = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Color API Documentation"
}));

app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running", status: 200 });
});

const login = require("./routes/login.route");
const register = require("./routes/register.route");
const colors = require("./routes/colors.route");
const users = require("./routes/users.route");
const auth = require("./routes/auth.route");




app.get("/apitest", (req, res) => {
    res.status(200).json({ message: "Test route is working", status: 200 });
});

app.use("/api/colors", colors);
app.use("/api", users);
app.use("/api", auth);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "../public/pages/notfound.html"));
});

const { closeAllPools } = require("./config/db.connection.root");

const PORT = parseInt(process.env.API_PORT, 10);

let server;

if (!isNaN(PORT) && Number.isInteger(PORT) && PORT > 0) {
    try {
        server = app.listen(PORT, () => {
            console.log("server started on http://localhost:" + PORT);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
} else {
    console.error("PORT is not defined or not a valid number in environment variables");
    process.exit(1);
}

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    if (server) {
        server.close(async (err) => {
            if (err) {
                console.error('Error closing server:', err);
                process.exit(1);
            }
            
            console.log('HTTP server closed.');
            
            try {
                await closeAllPools();
                console.log('Database connections closed.');
                process.exit(0);
            } catch (error) {
                console.error('Error closing database connections:', error);
                process.exit(1);
            }
        });
    } else {
        try {
            await closeAllPools();
            console.log('Database connections closed.');
            process.exit(0);
        } catch (error) {
            console.error('Error closing database connections:', error);
            process.exit(1);
        }
    }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
