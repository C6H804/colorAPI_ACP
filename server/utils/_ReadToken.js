const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const ReadToken = (token) => {
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, message: "token decoded", status: 200, value: result };
    } catch (error) {
        console.error("Error verifying token:", error);
        return { valid: false, message: "invalid token", status: 401, error: error.message };
    }
}

module.exports = ReadToken;