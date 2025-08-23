const mongoose = require("mongoose");

const userProblemProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    status: {
      type: String,
      enum: ["Solved", "Attempted"],
      default: "Attempted",
    },
    solvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userProblemProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

module.exports = mongoose.model(
  "UserProblemProgress",
  userProblemProgressSchema
);
