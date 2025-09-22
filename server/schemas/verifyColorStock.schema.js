const joi = require("joi");

const colorStockSchema = joi.object({
    shiny_stock: joi.number().integer().min(0).max(1).optional(),
    matte_stock: joi.number().integer().min(0).max(1).optional(),
    sanded_stock: joi.number().integer().min(0).max(1).optional()
});


const verifyColorStock = (data) => {
    const { error, value } = colorStockSchema.validate(data);
    if (error) return { valid: false, message: error.details[0].message };
    return { valid: true, value: value };
};

module.exports = verifyColorStock;