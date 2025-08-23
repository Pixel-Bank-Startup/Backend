const cron = require("node-cron");
const Subscription = require("../model/premiumPlan/subscription");
const User = require("../model/authModel/userModel");

const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    const expiredSubs = await Subscription.find({
      status: "active",
      endDate: { $lt: now },
    });
    for (const sub of expiredSubs) {
      sub.status = "expired";
      await sub.save();

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
cron.schedule("0 0 * * *", checkExpiredSubscriptions);
module.exports = checkExpiredSubscriptions;
