const mysql = require("mysql2");
const db = require("../config/db.connection.root");

const addColor = async (type, value, color, name, shiny_stock, matte_stock, sanded_stock) => {
    const stmt = "INSERT INTO colors (type, value, color, name_en, name_fr, name_pt, shiny_stock, matte_stock, sanded_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [type, value, color, name, name, name, shiny_stock, matte_stock, sanded_stock];
    console.log("addColor DAO called with:", values); // TEMP
    try {
        const [results] = await db.execute(stmt, values);
        return { valid: true, message: "Color added successfully", status: 201, value: results.insertId };
    } catch (error) {
        console.error("addColor error:", error);
        return { valid: false, message: "failed to add color", status: 500 };
    }
};

module.exports = addColor;