const TextSolution = require("../../model/problemSolutionModel/textSolution");


const handleSubmitSolution = async (req, res) => {
  try {
    const { questionId, code, language, explanation } = req.body;
    const userId = req.user.id;

    if (!questionId || !code || !language) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const solution = await TextSolution.create({
      questionId,
      userId,
      code,
      language,
      explanation
    });

    res.status(201).json({ message: "Solution submitted successfully", solution });
  } catch (error) {
    res.status(500).json({ message: "Error submitting solution", error: error.message });
  }
};

// Get all solutions for a question
const handleGetSolutionsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const solutions = await TextSolution.find({ questionId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching solutions", error: error.message });
  }
};

// Get all solutions by a user
const handleGetSolutionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const solutions = await TextSolution.find({ userId })
      .populate("questionId", "title difficulty")
      .sort({ createdAt: -1 });

    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching solutions", error: error.message });
  }
};

module.exports = {
  handleSubmitSolution,
  handleGetSolutionsByQuestion,
  handleGetSolutionsByUser
};
