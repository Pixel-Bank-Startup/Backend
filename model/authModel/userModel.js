const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
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
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
