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
    solutionCode:{ 
      type: String
  
     },
    getHint:{ 
    type: String
     },
    category: {
      type: String,
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
    sample: {
      input: { type: String, required: true },
      output: { type: String, required: true },
      reasoning: { type: String }
    },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      }
    ],
    explanation: {
      type: String,
    },
      aboutTopic: {
      type: String,
    },
    languages: {
      type: [String],
      required: true,
    },
    starterCode: {
      type: Map,
      of: String, 
      default: {}, 
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

// Optional: compound index for unique title within collection & topic
ProblemSchema.index({ title: 1, collectionId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model("Problem", ProblemSchema);
