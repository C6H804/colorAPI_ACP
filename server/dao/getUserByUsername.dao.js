const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const getUserByUsername = async (username) => {
    // Utilisation de l'utilisateur userReader (SELECT sur users et permissions)
    const stmt = "SELECT * FROM users WHERE username = ? AND deleted = 0 LIMIT 1";
    const values = [username];
    try {
        // CORRECTION: utilisation de db.promise().execute() pour async/await avec destructuring
        const [results] = await db.execute(stmt, values);
        if (results.length === 0) return { valid: false, message: "user not found", status: 404 };
        return { valid: true, message: "user found", status: 200, value: results[0] };
    } catch (error) {
        console.error("Database error:", error);
        return { valid: false, message: "database error", status: 500 };
    }
}

module.exports = getUserByUsername;