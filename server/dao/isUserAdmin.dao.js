const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const isUserAdmin = async (userId) => {
    // Utilisation de l'utilisateur usersPermissionsReader (SELECT sur users_permissions)
    const stmt = "SELECT COUNT(id_user) AS result FROM users_permissions WHERE id_permission = 2 AND id_user = ?"; // 2 is the id of the "admin" permission
    const values = [userId];

    try {
        const [results] = await db.execute(stmt, values);
        if (results[0].result > 0) return { valid: true, value: true };
        return { valid: true, value: false };
    } catch (error) {
        console.error("Error checking if user is admin:", error);
        return { valid: false, error: "Database error" };
    }
}

module.exports = isUserAdmin;