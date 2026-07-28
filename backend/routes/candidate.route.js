const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const candidateController = require("../controllers/candidate.controller");

router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("candidate"),
    candidateController.dashboard
);

module.exports = router;