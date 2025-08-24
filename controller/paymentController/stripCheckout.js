const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Plan = require("../../model/premiumPlan/planModel");
const { handleCreateSubscription } = require("../premiumSubscription/subscription");

const createSubscriptionCheckoutSession = async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;

  try {
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Plan not found or inactive" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: plan.currency.toLowerCase(),
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.Frontend_URL}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.Frontend_URL}/premium-cancel`,
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
      },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Subscription Session Error:", error);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
};

const finalizeSubscription = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const { userId, planId } = session.metadata;
    req.body = {
      userId,
      planId,
      paymentProvider: "Stripe",
      paymentId: session.payment_intent,
    };

    
    return await handleCreateSubscription(req, res);
  } catch (error) {
    console.error("Finalize Subscription Error:", error);
    res.status(500).json({ message: "Subscription finalization failed", details: error.message });
  }
};

module.exports = { createSubscriptionCheckoutSession, finalizeSubscription };
