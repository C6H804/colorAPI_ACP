const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running", status: 200 });
});

const login = require("./routes/login.route");
const register = require("./routes/register.route");
const colors = require("./routes/colors.route");


app.use("/api", login);
app.use("/api", register);
app.use("/api/colors", colors);



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
