const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const Hash = async (data) => {
    try {
        const saltRounds = process.env.BCRYPT_SALT_ROUNDS;
        const hashData = await bcrypt.hash(data, parseInt(saltRounds, 10));
        console.log("Hashing successful, hash:", hashData);
        return { valid: true, value: hashData, message: "hashing successful", status: 200 };
    } catch (error) {
        console.error("Hashing error:", error);
        return { valid: false, message: "hashing failed", status: 500 };
    }
}

module.exports = Hash;