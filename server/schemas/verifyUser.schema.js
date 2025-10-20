const joi = require("joi");


const verifyUserSchema = async (data) => {
    if (!data || Object.keys(data).length === 0) return { valid: false, message: "no data provided", status: 400 };
    if (!data.username || !data.password) return { valid: false, message: "missing username or password", status: 400 };
    const username = data.username.trim();
    const password = data.password.trim();
    let description = "aucune description";
    if (data.description) description = data.description.trim();

    try {
        const userSchema = joi.object({
            username: joi.string().regex(/^[a-z_]+$/).min(3).max(255).required(),
            password: joi.string().min(8).max(50).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,50}$")).required(),
            description: joi.string().max(16777215).optional()
        });
        const result = await userSchema.validateAsync({ username, password, description }, { abortEarly: false });
        return { valid: true, message: "validation successful", status: 200, value: result };

    } catch (error) {
        console.error("Validation error:", error);
        return { valid: false, message: "error in the the validation of the data : " + error.message, status: 422 };
    }
};

module.exports = verifyUserSchema;