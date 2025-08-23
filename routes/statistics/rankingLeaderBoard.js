const express = require("express");
const { getAllRankings } = require("../../controller/leaderboardController/leaderboard");
const { updateRankingUser } = require("../../controller/problemProgress/problemProgress");
const router = express.Router();


router.post("/ranking/update", updateRankingUser);
router.get("/ranking/all", getAllRankings);

module.exports = router;
