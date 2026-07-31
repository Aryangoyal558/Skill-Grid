const express = require("express");
const router = express.Router();

// Import your auth middleware so only logged-in users can see analytics
// (Make sure this path matches your actual auth middleware file)
const authenticateUser = require("../middlewares/auth.middleware"); 
const reportController = require("../controllers/report.controller");

// The final URL will be: GET /analytics/dashboard
router.get(
    "/dashboard",
    authenticateUser,
    reportController.getAnalyticsDashboard
);

module.exports = router;