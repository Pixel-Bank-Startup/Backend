const mongoose = require('mongoose');

const problemFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['general', 'specific'],
    required: true
  },
  title: {
    type: String,
    required: false
  },
  generalIssue: {
    type: String,
    required: false
  },
    description: {
    type: String,
    required: false
  },
   testCases: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['UI', 'Bug', 'Wrong Solution', 'Difficulty Mismatch', 'Other'],
    default: 'Other'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'N/A'],
    default: 'N/A'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProblemFeedback', problemFeedbackSchema);
