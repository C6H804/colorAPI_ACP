const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const getUserById = async (id) => {
    // Utilisation de l'utilisateur userReader (SELECT sur users et permissions)
    const stmt = "SELECT * FROM users WHERE id = ?";
    const values = [id];
    try {
        const [results] = await db.execute(stmt, values);
        if (results.length === 0) return { valid: false, message: "user not found", status: 404 };
        return { valid: true, message: "user found", status: 200, value: results[0] };
    } catch (error) {
        console.error("Database error:", error);
        return { valid: false, message: "failed to retrieve user from id", status: 500};
    }
};

module.exports = getUserById;