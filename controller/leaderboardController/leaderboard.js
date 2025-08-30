const User = require("../../model/authModel/userModel");
const Problem = require("../../model/problemModel/problem");
const Statistics = require("../../model/userStatistics/stats");
const Ranking = require("../../model/userStatistics/leaderboard");


const calculateFlameScoreAndRank = async () => {
  try {
    const users = await User.find({}).lean();

    for (const user of users) {
      if (!user._id) continue;

      const stats = await Statistics.findOne({ user: user._id }).lean();
      if (!stats) continue;

      const solvedProblems = user.solvedProblems || [];
      let flameScore = 0;

      for (const sp of solvedProblems) {
        const problem = await Problem.findById(sp.problemId).lean();
        if (!problem) continue;

        if (problem.difficulty === "Easy") flameScore += 10;
        else if (problem.difficulty === "Medium") flameScore += 20;
        else if (problem.difficulty === "Hard") flameScore += 30;
      }

      flameScore += stats.currentStreak * 5;

      await User.findByIdAndUpdate(user._id, { flameScore });
      await Statistics.findOneAndUpdate({ user: user._id }, { flameScore });

      await Ranking.findOneAndUpdate(
        { userId: user._id },
        { flameScore },
        { upsert: true, new: true }
      );
    }

    const allRankings = await Ranking.find({}).sort({ flameScore: -1 }).lean();
    let currentRank = 1;
    for (const ranking of allRankings) {
      await Ranking.findByIdAndUpdate(ranking._id, { rank: currentRank });
      currentRank++;
    }

    console.log("Flame scores and ranks updated successfully!");
  } catch (error) {
    console.error("Error calculating flame scores and ranks:", error);
  }
};


const getAllRankings = async (req, res) => {
  try {
    const rankings = await Ranking.find({})
      .populate("userId", "fullName email") 
      .sort({ rank: 1 })
      .lean();

    console.log("Populated Rankings:", JSON.stringify(rankings, null, 2)); 

    const result = rankings.map(r => ({
      fullName: r.userId?.fullName || "",
      email: r.userId?.email || "",
      flameScore: r.flameScore,
      rank: r.rank,
    }));

    res.status(200).json({ success: true, rankings: result });
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { calculateFlameScoreAndRank,getAllRankings };
