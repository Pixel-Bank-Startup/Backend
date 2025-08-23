const express = require("express");
const { getUserStats } = require("../../controller/problemProgress/problemProgress");
const router = express.Router();

router.get("/stats", getUserStats);

module.exports = router;
