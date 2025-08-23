const cron = require("node-cron");
const { calculateFlameScoreAndRank } = require("../controller/leaderboardController/leaderboard");


cron.schedule("0 0 * * *", async () => {
  console.log("Running daily flame score and rank calculation...");
  await calculateFlameScoreAndRank();
  console.log("Daily ranking update completed.");
});
