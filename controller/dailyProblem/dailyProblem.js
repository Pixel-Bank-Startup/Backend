const DailyQuestion = require('../../model/problemModel/dailyQuestionModel');

const handleGetDailyQuestion = async (req, res) => {
  try {
    const dailyQuestion = await DailyQuestion.findOne()
      .populate('question');

    if (!dailyQuestion) {
      return res.status(404).json({ message: 'No daily question set yet' });
    }

    res.json({
      question: dailyQuestion.question,
      date: dailyQuestion.date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  handleGetDailyQuestion
};
