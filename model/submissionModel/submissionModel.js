const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
    userOutput: {
    type: [String],
    default: [],
  },
  expectedOutput: {
    type: [String],
    default: [],
  },
  language: {
    type: String,
    required: true,
    enum: ["python", "cpp", "javascript", "java", "c"],
  },
  results: [
    {
      testCase: String,
      userOutput: String,
      expectedOutput: String,
      passed: Boolean,
    },
  ],
    judgeResponses: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  status: {
    type: String,
    enum: ["passed", "failed","draft","pending"],
    default: "pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
