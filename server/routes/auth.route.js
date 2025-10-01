const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const getUserUserPermissions = require("../dao/permissions.dao").getUserUserPermissions;

router.use(auth);
router.get("/auth", async (req, res) => {
    // get permissions of the user
    console.log("User ID from auth middleware:", req.user.value.id);
    const permissions = await getUserUserPermissions(req.user.value.id);
    if (!permissions.valid) return res.status(200).json({ valid: true, message: "Authenticated but no permissions", value: { permissions: []} });
    res.status(200).json({ valid: true, message: "Authenticated", value: { permissions: permissions.value } });
});


module.exports = router;