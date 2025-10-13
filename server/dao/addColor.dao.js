const mysql = require("mysql2");
const getPool = require("../config/db.connection.root");

const addColor = async (type, value, color, nameFr, nameEn, namePt, shiny_stock, matte_stock, sanded_stock) => {
    const db = getPool("colorAdder");
    const stmt = "INSERT INTO colors (type, value, color, name_en, name_fr, name_pt, shiny_stock, matte_stock, sanded_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [type, value, color, nameEn, nameFr, namePt, shiny_stock, matte_stock, sanded_stock];
    console.log("addColor DAO called with:", values); // TEMP
    try {
        const [results] = await db.promise().execute(stmt, values);
        return { valid: true, message: "Color added successfully", status: 201, value: results.insertId };
    } catch (error) {
        console.error("addColor error:", error);
        return { valid: false, message: "failed to add color", status: 500 };
    }
};

module.exports = addColor;