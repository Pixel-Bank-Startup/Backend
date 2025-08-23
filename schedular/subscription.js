const cron = require("node-cron");
const Subscription = require("../model/premiumPlan/subscription");
const updateRankings = require("../model/problemProgress/problemProgress");
const User = require("../model/authModel/userModel");
const checkAndAwardBadges = require("../controller/badgeAward/userBadge");

const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    // Find all active subscriptions whose endDate is in the past
    const expiredSubs = await Subscription.find({
      status: "active",
      endDate: { $lt: now },
    });

    for (const sub of expiredSubs) {
      // Mark subscription as expired
      sub.status = "expired";
      await sub.save();

      // Update user access
      const user = await User.findById(sub.user);
      if (user) {
        user.hasPremiumAccess = false;
        user.premiumPlan = null;
        user.premiumStartDate = null;
        user.premiumEndDate = null;
        await user.save();
      }
    }
    console.log(`Checked and updated ${expiredSubs.length} expired subscriptions`);
  } catch (error) {
    console.error("Error checking expired subscriptions:", error);
  }
};

// Run every day at midnight
cron.schedule("0 0 * * *", checkExpiredSubscriptions);
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily ranking update...");
  await updateRankings();
});
cron.schedule("0 0 * * *", async () => {
  const users = await User.find({});
  for (const user of users) {
    await checkAndAwardBadges(user);
  }
});


module.exports = checkExpiredSubscriptions;
