const joi = require("joi");

const userSchema = joi.object({
    username: joi.string().regex(/^[a-z_]+$/).min(3).max(255).required(),
    description: joi.string().max(16777215).optional()
});

    const verifyNewPermissions = async (userInfo) => {
        if (!userInfo) return { message: "No user info provided", status: 400, valid: false };
        const { error } = userSchema.validate({ username: userInfo.username, description: userInfo.description });
        if (error) return { message: error.details[0].message, status: 400, valid: false };

        // verify format permissions
        if (!userInfo.permissions || typeof userInfo.permissions !== "object") return { message: "Permissions must be an array", status: 400, valid: false };
        return { message: "Validation successful", status: 200, valid: true };

    }

module.exports = verifyNewPermissions;