const Stats = require("../../model/userStatistics/stats");
const Ranking = require("../../model/userStatistics/leaderboard");

const handleUpdateRanking = async (userId) => {
  const stats = await Stats.findOne({ user: userId });
  if (!stats) return;

  const flameScore = calculateFlameScore(stats);

  await Ranking.findOneAndUpdate(
    { user: userId },
    { flameScore },
    { upsert: true, new: true }
  );

  // Recalculate ranks for all users
  const allRankings = await Ranking.find().sort({ flameScore: -1 });
  for (let i = 0; i < allRankings.length; i++) {
    allRankings[i].rank = i + 1;
    await allRankings[i].save();
  }
};

const handleCalculateFlameScore = (stats) => {
  const { totalQuestionsSolved, easySolved, mediumSolved, hardSolved, longestStreak } = stats;

  const baseScore = totalQuestionsSolved * 10;
  const difficultyBonus = (easySolved * 5) + (mediumSolved * 10) + (hardSolved * 20);
  const streakBonus = longestStreak * 15;

  return baseScore + difficultyBonus + streakBonus;
};

const handleGetLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Ranking.find()
      .populate("user")
      .sort({ flameScore: -1 })
      .limit(100); 

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  handleGetLeaderboard,
  handleUpdateRanking,
  handleCalculateFlameScore,
  
}