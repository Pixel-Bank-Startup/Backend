const express = require("express");
const { handleSubmitSolution, handleGetSolutionsByQuestion, handleGetSolutionsByUser } = require("../../controller/solutionController/problemSolution");
const router = express.Router();


router.post("/solution/submit", handleSubmitSolution);
router.get("/solution/question", handleGetSolutionsByQuestion);
router.get("/solution/user/:userId", handleGetSolutionsByUser);

module.exports = router;
