const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "0000",
    database: process.env.DB_DATABASE || "api_acp",
    port: process.env.DB_PORT || 3306
});

module.exports = pool.promise();