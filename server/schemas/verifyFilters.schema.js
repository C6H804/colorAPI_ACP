const joi = require("joi");

const filterSchema = joi.object({
    filter: joi.string().valid("shiny_stock", "matte_stock", "sanded_stock")
});

const verifyFilters = (filter) => {
    // console.log("Verifying filter:", filter);
    if (!filter || !filter.trim() || !["shiny_stock", "matte_stock", "sanded_stock"].includes(filter)) return { valid: false, message: "no filter provided", status: 400 };
    const { error, value } = filterSchema.validate({ filter });
    if (error) {
        console.error("verifyFilters error:", error);
        return { valid: false, message: "invalid filter", status: 400 };
    }
    return { valid: true, value: value.filter, status: 200 };
}

module.exports = verifyFilters;