const express = require("express");
const { handleGetPlans, handleGetPlanById } = require("../../controller/adminController/premiumPlan/plan");

const router = express.Router();


router.get("/premium-plan", handleGetPlans);
router.get("/premium-plan/:id", handleGetPlanById);

module.exports = router;
