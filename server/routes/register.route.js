const express = require("express");

const router = express.Router();

const registerController = require("../controllers/register.controller");


router.post("/register", async (req, res) => {
    const result = await registerController(req);
    return res.status(result.status).json({ message: result.message, value: result.value });
});
module.exports = router;