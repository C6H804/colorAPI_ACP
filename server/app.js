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
        'http://localhost:3000'
        // insérer ici les adresses pour l'accés à l'API
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

app.use("/api/colors", colors);
app.use("/api", users);
app.use("/api", auth);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "../public/pages/notfound.html"));
});

const PORT = parseInt(process.env.API_PORT, 10);

if (!isNaN(PORT) && Number.isInteger(PORT) && PORT > 0) {
    try {
        app.listen(PORT, () => {
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
