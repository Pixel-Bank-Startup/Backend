const Comment = require('../../model/problemCommentModel/commentModel');

const handleAddComment = async (req, res) => {
  try {
    const { questionId, commentText } = req.body;
    const userId = req.user.id; 

    if (!questionId || !commentText) {
      return res.status(400).json({ message: 'Question ID and comment text are required.' });
    }
    const comment = await Comment.create({ questionId, userId, commentText });
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

const handleGetCommentsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;
    const comments = await Comment.find({ questionId })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

module.exports = {
  handleAddComment,
  handleGetCommentsByQuestion
}
