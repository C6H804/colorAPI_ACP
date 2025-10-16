const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const getLogs = async () => {
    // Utilisation de l'utilisateur logReader (SELECT avec JOIN sur multiple tables)
    const stmt = "SELECT date, u.username, c.value, cct.description, uc.change_description FROM update_colors uc JOIN users u ON uc.id_user = u.id JOIN colors c ON uc.id_color = c.id JOIN colors_changes_types cct ON uc.id_color_change_types = cct.id ORDER BY uc.date DESC LIMIT 1000";
    try {
        const [results] = await db.execute(stmt);
        return { valid: true, message: "Logs retrieved", status: 200, value: results };
    } catch (error) {
        console.error("getLogs error:", error);
        return { valid: false, message: "Error retrieving logs", status: 500, value: null };
    }
}

module.exports = getLogs;