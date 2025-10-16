const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const getLastColorUpdate = async () => {
    const stmt = "SELECT b.name_fr, b.name_en, b.name_pt, b.value, b.color, a.date, a.change_description FROM update_colors a JOIN colors b ON a.id_color = b.id WHERE b.deleted = 0 ORDER BY a.date desc limit 1;";
    try { 
        const [result] = await db.execute(stmt);
        return { valid: true, message: "Last color update fetched", status: 200, value: result[0] ?? [] };
    } catch (error) {
        console.error("Error fetching last color update:", error);
        return { valid: false, message: "Error fetching last color update", status: 500, value: null };
    }
};

module.exports = getLastColorUpdate;