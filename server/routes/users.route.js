const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const verifyPermissions = require("../utils/_VerifyPermissions");
const permissionList = require("../controllers/permissionsList.controller");
const permissionUsers = require("../controllers/permissionsListUser.controller");
const loginController = require("../controllers/login.controller");
const registerController = require("../controllers/register.controller");
const getUsers = require("../dao/getUsers.dao");
const getLogs = require("../dao/getLogs.dao");
const { valid } = require("joi");
const editUser = require("../controllers/editUser.controller");
const deleteUser = require("../controllers/deleteUser.controller");

router.post("/login", async (req, res) => {
    const result = await loginController(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ valid:false, message: result.message, status: result.status });
    return res.status(200).json({valid:true, message: result.message, status: result.status, value: result.value });
});

router.use(auth);

const adminOnly = async (req, res) => {
    const verify = await verifyPermissions(req.user, ["admin"]);
    if (!verify.valid) return res.status(verify.status).json({ message: verify.message });
    return { valid: true, message: "Authorized", status: 200, value: null };
};


router.get("/users", async (req, res) => {
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message, valid: false });

    const users = await getUsers();
    if (!users.valid) return res.status(users.status).json({ message: users.message, valid: false });
    return res.status(200).json({ message: users.message, value: users.value, valid: true });
});

router.post("/addUser", async (req, res) => {
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });
    
    const result = await registerController(req);
    if (!result.valid) return res.status(result.status ? result.status : 500).json({ message: result.message, status: result.status, valid: false });
    return res.status(201).json({ message: result.message, status: result.status, value: result.value, valid: true });
});


router.post("/editUser/:id", async (req, res) => {
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });
    if (!req.params.id || req.params.id <= 0 || isNaN(parseInt(req.params.id, 10)) || !Number.isInteger(parseInt(req.params.id, 10))) return res.status(400).json({ message: "id is not valid", status: 400 });
    const result = await editUser(req);
    return res.status(result.status).json({ message: result.message, status: result.status, valid: result.valid });
});

router.post("/deleteUser/:id", async (req, res) => {
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });
    if (!req.params.id || req.params.id <= 0 || isNaN(parseInt(req.params.id, 10)) || !Number.isInteger(parseInt(req.params.id, 10))) return res.status(400).json({ message: "id is not valid", status: 400 });

    const result = await deleteUser(req, parseInt(req.params.id, 10));
    return res.status(result.status).json({ message: result.message, status: result.status, valid: result.valid });
});


router.get("/permissions", async (req, res) => {
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    const list = await permissionList(req);
    if (!list.valid) return res.status(list.status).json({ message: list.message, valid: false });
    return res.status(200).json({ message: list.message, value: list.value, valid: true });

});


router.get("/permissions/:id", async (req, res) => {
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    const list = await permissionUsers(req)
    if (!list.valid) return res.status(list.status).json({ message: list.message });
    return res.status(200).json({ message: list.message, value: list.value });
});

router.post("/permissions/grant/:id", async (req, res) => {

});

router.get("/permissions/revoke/:id", async (req, res) => {

});

const grantPermission = async (req) => {
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });

    if (!req.params.id || isNaN(parseInt(req.params.id, 10)) || !Number.isInteger(parseInt(req.params.id, 10)) || parseInt(req.params.id, 10) <= 0) return { valid: false, message: "id is not valid", status: 400 };
    const userId = parseInt(req.params.id, 10);
    const permissions = req.body.permissions;
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) return { valid: false, message: "permissions is required and should be a non-empty array", status: 400 };
}
router.get("/logs", async (req, res) => {
    console.log("get reqest received in logs");
    const adminCheck = await adminOnly(req, res);
    if (!adminCheck.valid) return res.status(adminCheck.status).json({ message: adminCheck.message });
    const logs = await getLogs();
    if (!logs.valid) return res.status(logs.status).json({ message: logs.message });
    return res.status(200).json({ message: logs.message, value: logs.value });

});







module.exports = router;