const express = require("express");
const { handleGetPlans, handleGetPlanById, handleCreatePlan, handleUpdatePlan, handleDeletePlan } = require("../../../controller/adminController/premiumPlan/plan");
const router = express.Router();


router.get("/premium", handleGetPlans);
router.get("/premium/:id", handleGetPlanById);
router.post("/premium", handleCreatePlan);
router.put("/premium/:id", handleUpdatePlan);
router.delete("/premium/:id", handleDeletePlan);

module.exports = router;
