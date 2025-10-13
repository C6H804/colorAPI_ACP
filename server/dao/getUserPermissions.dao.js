const mysql = require("mysql2");
const getPool = require("../config/db.connection.root");

const getUserPermissions = async (userId) => {
    // Utilisation de l'utilisateur userReader (SELECT sur users_permissions avec JOIN)
    const db = getPool("userReader");
    const stmt = " select p.* from users_permissions up join permissions p on up.id_permission = p.id join users u on up.id_user = u.id where u.id = ?";
    const values = [userId];
    try {
        const [results] = await db.promise().execute(stmt, values);
        return { valid: true, value: results };
    } catch (error) {
        console.error("getUserPermissions error:", error);
        return { valid: false, value: [] };
    }
};

module.exports = getUserPermissions;