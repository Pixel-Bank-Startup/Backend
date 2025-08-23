const mongoose = require("mongoose");
const Counter = require("./problemCounter");

const ProblemSchema = new mongoose.Schema(
  {
    problemId: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Linear Algebra",
        "Machine Learning",
        "Deep Learning",
        "NLP",
        "Statics",
        "Probability",
        "Array",
        "String",
        "Dynamic Programming",
        "Graph",
        "Tree",
        "Math",
        "Greedy",
        "Sorting",
        "Hashing",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["Solved", "Unsolved", "Draft"],
      default: "Unsolved",
    },
    constraints: {
      type: String,
    },
    sampleInput: {
      type: [],
      required: true,
      trim: true,
    },
    sampleOutput: {
      type: [],
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
    },
    languages: {
      type: [String],
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProblemCollection",
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
  },
  { timestamps: true }
);

ProblemSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "problemId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.problemId = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Problem", ProblemSchema);
