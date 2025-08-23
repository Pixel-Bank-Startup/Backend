const Statistics = require("../../model/userStatistics/stats");
const Badge = require("../../model/badgeModel/userBadge");
const User = require("../../model/authModel/userModel");

const handleAwardBadgeForStreak = async (userId) => {
  try {
    const stats = await Statistics.findOne({ user: userId });
    if (!stats) return;

    const milestoneBadges = await Badge.find({
      milestoneDays: { $in: [50, 100, 200, 500] },
    });

    for (const badge of milestoneBadges) {
      if (stats.currentStreak >= badge.milestoneDays) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { badges: badge._id }, 
        });
      }
    }
  } catch (error) {
    console.error("Error awarding badge:", error);
  }
};

module.exports = {
    handleAwardBadgeForStreak,
}
