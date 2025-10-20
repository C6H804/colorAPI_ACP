const jwt = require("jsonwebtoken");


const CreateToken = async (payload, permanent = false) => {
    const key = process.env.JWT_SECRET;
    const expiration = process.env.JWT_EXPIRES_IN;
    try {
        const token = permanent ? jwt.sign(payload, key) : jwt.sign(payload, key, { expiresIn: expiration });
        return { valid: true, value: token, message: "token created successfully", status: 200 };
    } catch (error) {
        return { valid: false, message: "token creation failed", status: 500 };
    }
}

module.exports = CreateToken;