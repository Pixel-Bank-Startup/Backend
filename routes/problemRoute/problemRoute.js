const express = require("express");
const { handleGetProblems, handleGetProblemById, handleSearchProblems } = require("../../controller/adminController/problem/problemController");
const { handleGetDailyQuestion } = require("../../controller/dailyProblem/dailyProblem");
const router = express.Router();


router.get("/problems", handleGetProblems);             
router.get("/problems/:id", handleGetProblemById); 
//GET /api/problems/search?title=graph
//GET /api/problems/search?category=Dynamic%20Programming
//GET /api/problems/search?title=tree&category=Graph&difficulty=Hard
router.get("/problems//search", handleSearchProblems);      
router.get('/daily-question', handleGetDailyQuestion);
module.exports = router;
