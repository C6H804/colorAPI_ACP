const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const updateLastConnexion = async (userId) => {
    // Utilisation de l'utilisateur userChanger (UPDATE/SELECT sur users pour last_connection)
    const stmt = "UPDATE users SET last_connection = NOW() WHERE id = ?";
    const values = [userId];
    try {
        const [result] = await db.execute(stmt, values);
        if (result.affectedRows === 1) return { valid: true };
        return { valid: false, message: "User not found", status: 404 };
    } catch (error) {
        console.error("Error updating last connection:", error);
        return { valid: false, message: "Database error", status: 500 };
    } 
}

module.exports = updateLastConnexion;