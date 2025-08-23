const Subscription = require("../../model/premiumSubscription/subscription");
const Plan = require("../../model/premiumSubscription/plan");
const User = require("../../model/userModel/userModel");

const handleCreateSubscription = async (req, res) => {
  try {
    const { userId, planId, paymentProvider, paymentId } = req.body;

    // Validate Plan
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Plan not found or inactive" });
    }

    // Validate User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for Existing Active Subscription
    const activeSubscription = await Subscription.findOne({
      user: user._id,
      status: "active",
      endDate: { $gte: new Date() },
    });

    if (activeSubscription) {
      return res.status(400).json({ message: "User already has an active subscription" });
    }

    // Create Subscription
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const subscription = await Subscription.create({
      user: user._id,
      plan: plan._id,
      startDate,
      endDate,
      status: "active", // could be 'pending' until payment confirmation
      paymentProvider,
      paymentId,
    });

    // Update User
    user.hasPremiumAccess = true;
    user.premiumPlan = plan._id;
    user.premiumStartDate = startDate;
    user.premiumEndDate = endDate;
    await user.save();

    return res.status(201).json({
      message: "Subscription taken successfully",
      subscription,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error taking subscription", error: error.message });
  }
};

module.exports = { handleCreateSubscription };
