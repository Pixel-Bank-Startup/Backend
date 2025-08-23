// models/VideoSolution.js
const mongoose = require("mongoose");

const videoSolutionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: {
      type: String, // Cloudinary or S3 video URL
      required: true,
    },
    description: {
      type: String, // optional explanation
      trim: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VideoSolution", videoSolutionSchema);
