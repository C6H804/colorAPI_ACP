const mysql = require("mysql2");
const db = require("../config/db.connection.root");


const getColorListFiltered = async (filter) => {
    // Utilisation de l'utilisateur colorReader (SELECT sur colors uniquement)
    const stmt = `SELECT * FROM colors WHERE ${filter} = 1 AND deleted = 0 ORDER BY type, value LIMIT 1000`;

    try {
        const [results] = await db.execute(stmt);
        return { valid: true, value: results, status: 200 };
    } catch (error) {
        console.error("getColorListFiltered error:", error);
        return { valid: false, message: "failed to get colors", status: 500 };
    }
}

const getColorListAvailable = async () => {
    // Utilisation de l'utilisateur colorReader (SELECT sur colors uniquement)
    const stmt = "SELECT * FROM colors WHERE (shiny_stock > 0 OR matte_stock > 0 OR sanded_stock > 0) AND deleted = 0 ORDER BY type, value LIMIT 1000";
    try {
        const [results] = await db.execute(stmt);
        return { valid: true, value: results, status: 200 };
    } catch (error) {
        console.error("getColorListAvailable error:", error);
        return { valid: false, message: "failed to get colors", status: 500 };
    } 
}

const getColorList = async () => {
    // Utilisation de l'utilisateur colorReader (SELECT sur colors uniquement)
    const stmt = "SELECT * FROM colors WHERE deleted = 0 ORDER BY type, value LIMIT 1000";
    try {
        const [results] = await db.execute(stmt);
        return { valid: true, value: results, status: 200 };
    } catch (error) {
        console.error("getColorList error:", error);
        return { valid: false, message: "failed to get colors", status: 500 };
    }
}

module.exports = { getColorList, getColorListFiltered, getColorListAvailable };