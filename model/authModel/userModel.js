const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      default: "",
    },
    badges: [
      {
        badgeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Badge",
        },
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    solvedProblems: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
        },
        solvedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: {
      type: String,
      default: "",
    },
    gitHubUsername: {
      type: String,
      default: "",
    },
    linkedInProfileURL: {
      type: String,
      default: "",
    },
    kaggleUsername: {
      type: String,
      default: "",
    },
    rank: {
      type: Number,
    },
    currentStreakInDays: {
      type: Number,
    },
    totalStreakInDays: {
      type: Number,
    },
    flameScoreAttained: {
      type: Number,
    },
    hasPremiumAccess: {
      type: Boolean,
      default: false,
    },
    premiumPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    flameScore: {
      type: Number,
      default: 0,
    },
    isEmailVisible: {
      type: Boolean,
      default: false,
    },
    isSocialVisible: {
      type: Boolean,
      default: false,
    },
    isBadgeVisible: {
      type: Boolean,
      default: false,
    },
    premiumStartDate: { type: Date },
    premiumEndDate: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
