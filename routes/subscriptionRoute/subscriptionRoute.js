const express = require("express");
const { handleCreateSubscription } = require("../../controller/premiumSubscription/subscription");
const router = express.Router();

router.post("/subscribe-plan", handleCreateSubscription);

module.exports = router;
