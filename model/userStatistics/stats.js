const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalQuestionsSolved: {
    type: Number,
    default: 0,
  },
  easyQuestionsSolved: {
    type: Number,
    default: 0,
  },
  mediumQuestionsSolved: {
    type: Number,
    default: 0,
  },
  hardQuestionsSolved: {
    type: Number,
    default: 0,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  completionRate: {
    type: Number,
    default: 0, 
  },
  lastSolvedDate: {
    type: Date,
    default: null, 
  },
  favoriteCategory: { 
    type: String,
     default: ""
     },
}, { timestamps: true });

module.exports = mongoose.model("Statistics", statisticsSchema);
