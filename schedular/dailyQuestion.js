const cron = require('node-cron');
const Problem = require('../model/problemModel/problem');
const DailyQuestion = require('../model/problemModel/dailyQuestionModel');

cron.schedule('0 0 * * *', async () => { // runs every midnight
  try {
    const totalProblems = await Problem.countDocuments();
    const randomIndex = Math.floor(Math.random() * totalProblems);
    const randomProblem = await Problem.findOne().skip(randomIndex);

    await DailyQuestion.findOneAndUpdate(
      {}, // update the single document
      { question: randomProblem._id, date: new Date() },
      { upsert: true, new: true }
    );

    console.log(`Daily Question Updated: ${randomProblem.title}`);
  } catch (error) {
    console.error('Error updating daily question:', error);
  }
});
