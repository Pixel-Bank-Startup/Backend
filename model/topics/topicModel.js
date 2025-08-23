const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProblemCollection",
      required: true,
    },
  },
  { timestamps: true }
);

TopicSchema.index({ name: 1, collectionName: 1 }, { unique: true });

module.exports = mongoose.model("Topic", TopicSchema);
