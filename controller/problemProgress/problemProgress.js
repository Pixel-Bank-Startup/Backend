const UserProblemProgress = require("../../model/problemProgress/problemProgress");
const User = require("../../model/userModel/userModel");

const handleMarkProblemSolved = async (req, res) => {
  try {
    const { problemId } = req.body;
    const userId = req.user.id;

    await UserProblemProgress.findOneAndUpdate(
      { user: userId, problem: problemId },
      { status: "Solved", solvedAt: new Date() },
      { upsert: true, new: true }
    );

    // Increment user's stats
    await User.findByIdAndUpdate(userId, { $inc: { totalStreakInDays: 1 } });

    res.json({ success: true, message: "Problem marked as solved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleMarkProblemSolved
};
