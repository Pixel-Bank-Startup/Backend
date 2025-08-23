const Statistics = require("../../model/userStatistics/stats");
const { calculateFlameScoreAndRank } = require("../leaderboardController/leaderboard");

const getUserStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(200).json({
        totalQuestionsSolved: 0,
        easyQuestionsSolved: 0,
        mediumQuestionsSolved: 0,
        hardQuestionsSolved: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        lastSolvedDate: null,
      });
    }

    let stats = await Statistics.findOne({ user: userId }).lean();

    if (!stats) {
      stats = {
        totalQuestionsSolved: 0,
        easyQuestionsSolved: 0,
        mediumQuestionsSolved: 0,
        hardQuestionsSolved: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        lastSolvedDate: null,
      };
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      message: "Error fetching user stats",
      error: error.message,
    });
  }
};

const updateRankingUser = async(req, res)=>{
 try {
    await calculateFlameScoreAndRank();
    res.status(200).json({ message: "Ranking and flame score updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating ranking", error: error.message });
  }
}

module.exports = {
  getUserStats,
  updateRankingUser 
};
