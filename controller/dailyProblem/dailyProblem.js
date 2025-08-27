const DailyQuestion = require('../../model/problemModel/dailyQuestionModel');
const Problem = require('../../model/problemModel/problem');


const handleGetDailyQuestion = async (req, res) => {
  try {
    const dailyQuestion = await DailyQuestion.findOne()
      .populate('question', 'title problemId');

    if (!dailyQuestion) {
      return res.status(404).json({ message: 'No daily question set yet' });
    }
    //question randomly changes every day
  res.json({
      question: {
        id: dailyQuestion.question._id,
        problemId: dailyQuestion.question.problemId,
        title: dailyQuestion.question.title
      },
      date: dailyQuestion.date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


 const dailyQuestionUpdate = async (req, res)=>{
  try {
    const totalProblems = await Problem.countDocuments();
    if (totalProblems === 0) {
      return res.status(404).json({ success: false, message: 'No problems found' });
    }

    const randomIndex = Math.floor(Math.random() * totalProblems);
    const randomProblem = await Problem.findOne().skip(randomIndex);

    await DailyQuestion.findOneAndUpdate(
      {},
      { question: randomProblem._id, date: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: `Daily Question Updated: ${randomProblem.title}`,
      questionId: randomProblem._id
    });
  } catch (error) {
    console.error('Error in test API:', error);
    res.status(500).json({ success: false, message: error.message });
  }
 }

module.exports = {
  handleGetDailyQuestion,
  dailyQuestionUpdate
};
