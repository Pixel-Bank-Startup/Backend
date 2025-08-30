const User = require("../../model/authModel/userModel");
const Problem = require("../../model/problemModel/problem");
const Statistics = require("../../model/userStatistics/stats");

const updateFavoriteCategory = async (userId) => {
  try {

    const user = await User.findById(userId).populate("solvedProblems.problemId", "category");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.solvedProblems || user.solvedProblems.length === 0) {
      return res.status(400).json({ message: "No solved problems for this user" });
    }

    const categoryCount = {};
    user.solvedProblems.forEach(entry => {
      const category = entry.problemId?.category;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    let favoriteCategory = "";
    let maxCount = 0;
    for (const [category, count] of Object.entries(categoryCount)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteCategory = category;
      }
    }

    const stats = await Statistics.findOneAndUpdate(
      { user: userId },
      { favoriteCategory },
      { new: true, upsert: true }
    );

    return res.status(200).json({ message: "Favorite category updated", stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { updateFavoriteCategory };