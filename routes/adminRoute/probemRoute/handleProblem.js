const express = require("express");
const { handleAddProblems, handleUpdateProblem, handleDeleteProblem } = require("../../../controller/adminController/problem/problemController");
const router = express.Router();


router.post("/problems/add", handleAddProblems);          
router.put("/problems/update/:id", handleUpdateProblem);  
router.delete("/problems/delete/:id", handleDeleteProblem);      
module.exports = router;
