const express = require("express");
const { handleSubmitSolution, handleGetSolutionsByQuestion, handleGetSolutionsByUser } = require("../../controller/solutionController/problemSolution");
const router = express.Router();


router.post("/submit", handleSubmitSolution);
router.get("/question/:questionId", handleGetSolutionsByQuestion);
router.get("/user/:userId", handleGetSolutionsByUser);

module.exports = router;
