const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, 
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    paymentProvider: {
      type: String,
    }, 
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);
SubscriptionSchema.index({ user: 1, status: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model("Subscription", SubscriptionSchema);
