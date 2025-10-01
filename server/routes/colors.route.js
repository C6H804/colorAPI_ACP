const express = require("express");
const router = express.Router();



const auth = require("../middlewares/auth");
const getColorsController = require("../controllers/colorsList.controller");
const verifyPermissions = require("../utils/_VerifyPermissions");
const modifyColorStock = require("../controllers/modifyColorStock.controller");

router.use(auth);

router.post("/list", async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin", "visitor", "modify_colors"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });
    // console.log("Filter received:", req.body.filter); // Debugging line

    const result = await getColorsController(req.body.filter);
    res.status(result.status).json(result);
});

router.get("/modify/allow", async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin", "modify_colors"]);
    if (!verify.valid) return res.status(verify.status).json({ valid:false, message: verify.message });
    return res.status(200).json({ valid: true, message: "Permission granted" });
}); // TO DELETE


router.post("/modifyStock/:id", async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin", "color manager"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });

    const result = await modifyColorStock(req);
    return res.status(result.status).json({ message: result.message, valid: result.valid });
});

module.exports = router;