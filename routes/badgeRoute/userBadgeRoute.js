const express = require("express");
const { handleGetUserBadges } = require("../../controller/adminController/badgeController/userBadge");
const router = express.Router();


router.get("/badges", handleGetUserBadges);

module.exports = router;
