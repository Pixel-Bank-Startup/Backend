const Subscription = require("../../model/premiumPlan/subscription");
const Plan = require("../../model/premiumPlan/planModel");
const User = require("../../model/authModel/userModel");

const handleCreateSubscription = async (req, res) => {
  try {
    const { planId, paymentProvider, paymentId } = req.body;
    const userId = req.user.id;

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Plan not found or inactive" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activeSubscription = await Subscription.findOne({
      userId: user._id,
      status: "active",
      endDate: { $gte: new Date() },
    });

    if (activeSubscription) {
      return res.status(400).json({ message: "User already has an active subscription" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const subscription = await Subscription.create({
      userId: user._id,
      planId: plan._id,
      startDate,
      endDate,
      status: "active", 
      paymentProvider,
      paymentId,
    });

    user.hasPremiumAccess = true;
    user.premiumPlan = plan._id;
    user.premiumStartDate = startDate;
    user.premiumEndDate = endDate;
    await user.save();

    return res.status(201).json({
      message: "Subscription taken successfully",
      subscription,
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error taking subscription", error: error.message });
  }
};

module.exports = { handleCreateSubscription };