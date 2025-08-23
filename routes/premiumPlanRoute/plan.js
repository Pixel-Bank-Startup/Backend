const express = require("express");
const { handleGetPlans, handleGetPlanById } = require("../../controller/adminController/premiumPlan/plan");

const router = express.Router();


router.get("/", handleGetPlans);
router.get("/:id", handleGetPlanById);

module.exports = router;
