const mongoose = require("mongoose");

const ProblemCollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    coverImageUrl: {
      type: String,
    },
    section: {
      type: Number,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProblemCollection", ProblemCollectionSchema);
