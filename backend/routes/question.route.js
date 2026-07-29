const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const questionController = require("../controllers/question.controller");

router.post(

    "/",

    authenticateUser,

    authorizeRoles("examiner", "admin"),

    questionController.addQuestion

);

router.get(
    "/manage/:id",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    questionController.getQuestions
);

// Candidate - Take Assessment
router.get(
    "/assessment/:id",
    authenticateUser,
    authorizeRoles("candidate", "examiner", "admin"),
    questionController.getQuestions
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    questionController.deleteQuestion
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    questionController.updateQuestion
);


module.exports = router;