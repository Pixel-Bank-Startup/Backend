const express = require("express");
const { createSubscriptionCheckoutSession, finalizeSubscription } = require("../../controller/paymentController/stripCheckout");


const router = express.Router();

router.post("/subscribe-now/checkout", createSubscriptionCheckoutSession);
router.get("/subscribe-now/finalize", finalizeSubscription);

module.exports = router;
