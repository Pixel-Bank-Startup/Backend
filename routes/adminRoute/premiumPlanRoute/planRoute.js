const express = require("express");
const { handleGetPlans, handleGetPlanById, handleCreatePlan, handleUpdatePlan, handleDeletePlan } = require("../../../controller/adminController/premiumPlan/plan");
const router = express.Router();


router.get("/", handleGetPlans);
router.get("/:id", handleGetPlanById);
router.post("/", handleCreatePlan);
router.put("/:id", handleUpdatePlan);
router.delete("/:id", handleDeletePlan);

module.exports = router;
