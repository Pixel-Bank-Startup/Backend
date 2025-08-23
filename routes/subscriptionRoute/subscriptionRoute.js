const express = require("express");
const { handleCreateSubscription } = require("../../controller/premiumSubscription/subscription");
const router = express.Router();

router.post("/take", handleCreateSubscription);

module.exports = router;
