const verifyColorStock = require("../schemas/verifyColorStock.schema");
const addColorDao = require("../dao/addColor.dao");
const addLog = require("../dao/addColorLog.dao");

const addColor = async (req) => {
    try {
        if (!req.body.nameFr || !req.body.nameEn || !req.body.namePt || !req.body.hex || !req.body.stock || !req.body.ral) return { valid: false, message: "Missing required fields", status: 400 };
        const verifyStock = verifyColorStock(req.body.stock);
        if (!verifyStock.valid) return { valid: false, message: verifyStock.message, status: 400 };
        if (
            typeof req.body.nameFr !== "string" || req.body.nameFr.trim().length < 3 || req.body.nameFr.trim().length > 254 ||
            typeof req.body.nameEn !== "string" || req.body.nameEn.trim().length < 3 || req.body.nameEn.trim().length > 254 ||
            typeof req.body.namePt !== "string" || req.body.namePt.trim().length < 3 || req.body.namePt.trim().length > 254
        ) return { valid: false, message: "Invalid name(s)", status: 400 };
        if (typeof req.body.hex !== "string" || !/^#([0-9A-F]{3}){1,2}$/i.test(req.body.hex)) return { valid: false, message: "Invalid hex code", status: 400 };
        if (typeof req.body.ral !== "string" || req.body.ral.length < 3 || req.body.ral.length > 20) return { valid: false, message: "Invalid RAL code", status: 400 };
    
        const nameFr = req.body.nameFr.trim();
        const nameEn = req.body.nameEn.trim();
        const namePt = req.body.namePt.trim();
        const value = req.body.ral.trim().toUpperCase();
        const hex = req.body.hex.trim().toUpperCase().replace("#", "");
        const shiny_stock = req.body.stock.shiny_stock;
        const matte_stock = req.body.stock.matte_stock;
        const sanded_stock = req.body.stock.sanded_stock;
        const type = value.startsWith("RAL") ? "RAL" : "OTHER";


        const addLogResult = await addLog(req.user.value.id, 257, `Ajout de la couleur ${nameFr} / ${nameEn} / ${nameEn} - ${value} - #${hex} - Stocks (Shiny: ${shiny_stock}, Matte: ${matte_stock}, Sanded: ${sanded_stock})`, 2);
        if (!addLogResult.valid) console.error("Failed to add log for adding color:", addLogResult.message);
    
        const result = await addColorDao(type, value, hex, nameFr, nameEn, namePt, shiny_stock, matte_stock, sanded_stock);
    
        if (!result.valid) return { valid: false, message: result.message, status: result.status ? result.status : 500 };
        
        
        return { valid: true, message: "Color added successfully", status: 201, value: result.value };
    } catch (error) {
        console.error("Error in addColor controller:", error);
        return { valid: false, message: "Internal server error", status: 500 };
    }
}


module.exports = addColor;