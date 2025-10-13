const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const deleteColorDao = async (id) => {
    // Utilisation de l'utilisateur colorDeleter (UPDATE/SELECT sur colors pour soft delete)
    const stmt = "UPDATE colors SET deleted = 1 WHERE id = ?";
    const values = [id];
    try {
        const [results] = await db.execute(stmt, values);
        if (results.affectedRows === 0) return { valid: false, message: "Color not found", status: 404 };
        return { valid: true, message: "Color deleted successfully", status: 200 };
    } catch (error) {
        console.error("Error deleting color:", error);
        return { valid: false, message: "Internal server error", status: 500 };
    }
};

module.exports = deleteColorDao;