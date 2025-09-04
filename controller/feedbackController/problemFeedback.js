const ProblemFeedback = require('../../model/feedbackModel/problemFeedback');
const adminEmail = process.env.ADMIN_EMAIL;

const handleCreateFeedback = async (req, res) => {
  try {
    const { problemId, feedbackType, title, description, generalIssue,testCases, category, difficulty } = req.body;

    const feedback = await ProblemFeedback.create({
      userId: req.user.id,
      problemId,
      feedbackType,
      title,
      description,
      category,
      difficulty,
      generalIssue,
      testCases
    });

    await sendFeedbackNotificationEmail(adminEmail, feedback);
  
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleGetAllFeedback = async (req, res) => {
  try {
    const feedbacks = await ProblemFeedback.find().populate('userId', 'fullName email').populate('problemId', 'title');
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleGetUserFeedback = async (req, res) => {
  try {
    const feedbacks = await ProblemFeedback.find({ userId: req.user.id }).populate('problemId', 'title');
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleUpdateFeedbackStatus = async (req, res) => {
  try {
    const {id, status } = req.body;

    const feedback = await ProblemFeedback.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleCreateFeedback,
  handleGetAllFeedback,
  handleGetUserFeedback,
  handleUpdateFeedbackStatus
};
