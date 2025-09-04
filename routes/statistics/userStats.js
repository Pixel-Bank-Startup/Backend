const express = require("express");
const { getUserStats } = require("../../controller/problemProgress/problemProgress");
const { updateFavoriteCategory } = require("../../controller/stats/userStats");
const router = express.Router();

router.get("/stats/:userId", getUserStats);
router.put("/favorite-category", updateFavoriteCategory);

module.exports = router;
