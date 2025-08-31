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

    description: {
    type: String,
    required: false
  },
   testCases: {
    type: String,
    required: false
  },
   learnSection: {
    type: String,
    required: false
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
   category: {
    type: String,
    required: false
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
