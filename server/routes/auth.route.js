const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { route } = require("./colors.route");

router.use(auth);
router.post("/auth", async (req, res) => {
res.status(200).json({ valid: true, message: "Authenticated" });
});


module.exports = router;