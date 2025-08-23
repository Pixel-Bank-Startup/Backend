const Badge = require("../../model/badgeModel/userBadge");

async function checkAndAwardBadges(user) {
  const badges = await Badge.find({});
  const earnedBadgeIds = user.earnedBadges.map(b => b.badge.toString());

  for (const badge of badges) {
    if (user.totalStreak >= badge.milestoneDays && !earnedBadgeIds.includes(badge._id.toString())) {
      user.earnedBadges.push({ badge: badge._id, dateEarned: new Date() });
    }
  }
  await user.save();
}

module.exports = checkAndAwardBadges;
