const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const examinerController = require("../controllers/examiner.controller");

router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("examiner"),
    examinerController.dashboard
);

module.exports = router;