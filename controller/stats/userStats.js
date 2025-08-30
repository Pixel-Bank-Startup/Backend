const User = require("../../model/authModel/userModel");
const Statistics  = require('../../model/userStatistics/stats')

const updateFavoriteCategory = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate("solvedProblems.problemId", "category");
    if (!user) return null;

    if (!user.solvedProblems.length) return null;

    const categoryCount = {};
    user.solvedProblems.forEach(({ problemId }) => {
      const category = problemId?.category;
      if (category) categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    return await Statistics.findOneAndUpdate(
      { user: userId },
      { favoriteCategory },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { updateFavoriteCategory };