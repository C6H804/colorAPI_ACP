const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const changePassword = async (userId, newHashedPassword) => {
    // Utilisation de l'utilisateur passwordChanger (UPDATE/SELECT sur users pour password)
    const stmt = "UPDATE users SET password = ? WHERE id = ? AND deleted = 0";
    const values = [newHashedPassword, userId];
    try {
        const [result] = await db.execute(stmt, values);
        if (result.affectedRows === 0) return { message: "User not found or already deleted", status: 404, valid: false };
        return { message: "Password updated successfully", status: 200, valid: true };
    } catch (error) {
        console.error("Database error changing password:", error);
        return { message: "Database error", status: 500, valid: false };
    }
};

module.exports = changePassword;