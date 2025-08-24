const express = require("express");
const {  handleCreatePlan, handleUpdatePlan, handleDeletePlan } = require("../../../controller/adminController/premiumPlan/plan");
const router = express.Router();



router.post("/premium/add", handleCreatePlan);
router.put("/premium/:id", handleUpdatePlan);
router.delete("/premium/:id", handleDeletePlan);

module.exports = router;
