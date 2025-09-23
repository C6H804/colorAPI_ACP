const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const verifyPermissions = require("../utils/_VerifyPermissions");
const permissionList = require("../controllers/permissionsList.controller");
const permissionUsers = require("../controllers/permissionsListUser.controller");
const loginController = require("../controllers/login.controller");
const registerController = require("../controllers/register.controller");

router.post("/login", async (req, res) => {
    const result = await loginController(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ message: result.message, status: result.status });
    return res.status(200).json({ message: result.message, status: result.status, value: result.value });
});

router.use(auth);

router.use(async (req, res, next) => {
    const verify = await verifyPermissions(req.user, ["admin"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });
    next();
});

router.post("/addUser", async (req, res) => {
    const result = await registerController(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ message: result.message, status: result.status });
    return res.status(201).json({ message: result.message, status: result.status, value: result.value });
});



router.get("/permissions", async (req, res) => {
    const list = await permissionList(req);
    if (!list.valid) return res.status(list.status).json({ message: list.message });
    return res.status(200).json({ message: list.message, value: list.value });

});


router.get("/permissions/:id", async (req, res) => {


    const list = await permissionUsers(req)
    if (!list.valid) return res.status(list.status).json({ message: list.message });
    return res.status(200).json({ message: list.message, value: list.value });
});

router.post("/permissions/grant/:id", async (req, res) => {

});




const grantPermission = async (req) => {
    if (!req.params.id || isNaN(parseInt(req.params.id, 10)) || !Number.isInteger(parseInt(req.params.id, 10)) || parseInt(req.params.id, 10) <= 0) return { valid: false, message: "id is not valid", status: 400 };
    const userId = parseInt(req.params.id, 10);
    const permissions = req.body.permissions;
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) return { valid: false, message: "permissions is required and should be a non-empty array", status: 400 };
    permissions.forEach( e => {
        
    });

}



module.exports = router;