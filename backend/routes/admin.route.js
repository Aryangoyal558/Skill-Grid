const express = require("express");

const router = express.Router();

const authenticateUser =
require("../middlewares/auth.middleware");

const authorizeRoles =
require("../middlewares/role.middleware");

const adminController =
require("../controllers/admin.controller");

router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("admin"),
    adminController.dashboard
);

module.exports = router;