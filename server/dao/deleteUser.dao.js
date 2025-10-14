const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const deleteUser = async (userId) => {
    // Utilisation de l'utilisateur userDeleter (UPDATE/SELECT sur users + DELETE sur users_permissions)
    const stmt = "UPDATE users SET deleted = 1 WHERE id = ?";
    const values = [userId];
    try {
        const [results] = await db.execute(stmt, values);
        return { valid: true, message: "user deleted successfully", status: 200 };
    } catch (error) {
        console.error("error in deleteUser.dao.js:", error);
        return { valid: false, message: "Database error", status: 500 };
    }
};



const deletePermissions = async (userId) => {
    const stmt = "DELETE FROM users_permissions WHERE id_user = ?";
    const values = [userId];
    try {
        const [results] = await db.execute(stmt, values);
        return { valid: true, message: "user permissions deleted successfully", status: 200 };
    } catch (error) {
        console.error("error in deleteUser.dao.js:", error);
        return { valid: false, message: "Database error", status: 500 };
    }
}

module.exports = { deleteUser, deletePermissions };