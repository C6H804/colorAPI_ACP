const verifyColorStock = require("../schemas/verifyColorStock.schema");
const addColorDao = require("../dao/addColor.dao");

const addColor = async (req) => {
    if (!req.body.name || !req.body.hex || !req.body.stock || !req.body.ral) return { valid: false, message: "Missing required fields", status: 400 };
    const verifyStock = verifyColorStock(req.body.stock);
    if (!verifyStock.valid) return { valid: false, message: verifyStock.message, status: 400 };
    if (typeof req.body.name !== "string" || req.body.name.length < 3) return { valid: false, message: "Invalid name", status: 400 };
    if (typeof req.body.hex !== "string" || !/^#([0-9A-F]{3}){1,2}$/i.test(req.body.hex)) return { valid: false, message: "Invalid hex code", status: 400 };
    if (typeof req.body.ral !== "string" || req.body.ral.length < 3 || req.body.ral.length > 20) return { valid: false, message: "Invalid RAL code", status: 400 };

    const name = req.body.name.trim();
    const value = req.body.ral.trim().toUpperCase();
    const hex = req.body.hex.trim().toUpperCase().replace("#", "");
    const shiny_stock = req.body.stock.shiny_stock;
    const matte_stock = req.body.stock.matte_stock;
    const sanded_stock = req.body.stock.sanded_stock;
    const type = value.startsWith("RAL") ? "RAL" : "OTHER";

    const result = await addColorDao(type, value, hex, name, shiny_stock, matte_stock, sanded_stock);
    


    if (!result.valid) return { valid: false, message: result.message, status: result.status ? result.status : 500 };
    return { valid: true, message: "Color added successfully", status: 201, value: result.value };
}


module.exports = addColor;