const Submission = require("../../model/submissionModel/submissionModel");
const Problem = require("../../model/problemModel/problem");
const User = require("../../model/authModel/userModel");
const Statistics = require("../../model/userStatistics/stats");
const { handleAwardBadgeForStreak } = require("../badgeAward/userBadge");

const executeCode = async (code, language, input) => {
  return "dummy_output";
};

const handleSubmitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.languages && !problem.languages.includes(language)) {
      return res.status(400).json({
        message: `This problem only supports ${problem.languages.join(", ")}, but you submitted ${language}.`,
      });
    }

    const executionResult = await executeCode(code, language, problem.sampleInput);

    const actualOutput = problem.sampleOutput;
    const expectedOutput = problem.sampleOutput;

    const isCorrect = actualOutput === expectedOutput;

    let isFirstSolve = false;

    if (isCorrect) {
      const user = await User.findById(userId).select("solvedProblems").lean();
      const alreadySolved = user?.solvedProblems?.some(
        sp => sp.problemId.toString() === problemId
      );

      if (!alreadySolved) {
        isFirstSolve = true;

      
        await User.findByIdAndUpdate(userId, {
          $addToSet: { solvedProblems: { problemId: problem._id, solvedAt: new Date() } },
        });

       
        let stats = await Statistics.findOne({ user: userId });
        const now = new Date();

        if (!stats) stats = new Statistics({ user: userId });

        stats.totalQuestionsSolved += 1;
        stats.lastSolvedDate = now;

        switch (problem.difficulty) {
          case "Easy":
            stats.easyQuestionsSolved += 1;
            break;
          case "Medium":
            stats.mediumQuestionsSolved += 1;
            break;
          case "Hard":
            stats.hardQuestionsSolved += 1;
            break;
        }

      
        if (stats.currentStreak > 0 && stats.lastSolvedDate) {
          const lastDate = new Date(stats.lastSolvedDate);
          const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
          stats.currentStreak = diffDays === 1 ? stats.currentStreak + 1 : 1;
        } else {
          stats.currentStreak = 1;
        }

        if (stats.currentStreak > stats.longestStreak) stats.longestStreak = stats.currentStreak;

        const totalProblems = await Problem.countDocuments();
        stats.completionRate = Math.floor((stats.totalQuestionsSolved / totalProblems) * 100);

        await stats.save();
      }
    }

    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      status: isCorrect ? "passed" : "failed",
      userOutput: actualOutput,
      expectedOutput: expectedOutput,
    });

    await submission.save();
    await handleAwardBadgeForStreak(userId);
  
    res.status(200).json({
      message: "Submission saved successfully",
      submissionId: submission.id,
      status: submission.status,
      userOutput: actualOutput,
      expectedOutput: expectedOutput,
      firstSolve: isFirstSolve, 
    });
  } catch (error) {
    console.error("Error in handleSubmitCode:", error);
    res.status(500).json({
      message: "Error submitting code",
      error: error.message,
    });
  }
};

const handleSaveCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    let draft = await Submission.findOne({
      userId,
      problemId,
      status: "draft",
    });

    if (draft) {
      draft.code = code;
      draft.language = language;
      await draft.save();
    } else {
      draft = new Submission({
        userId,
        problemId,
        code,
        language,
        status: "draft",
      });
      await draft.save();
    }

    res.status(200).json({ message: "Code saved successfully", draft });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving code", error: error.message });
  }
};

const handleGetUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.body;

    const submissions = await Submission.find({
      userId,
      problemId,
      status: { $ne: "draft" },
    }).sort({ submittedAt: -1 });

    res.status(200).json({ submissions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

const getSavedDraft = async (req, res) => {
  try {
    const { problemId } = req.body;
    const userId = req.user.id;

    const draft = await Submission.findOne({
      userId,
      problemId,
      status: "draft",
    });

    if (!draft) {
      return res.status(200).json({ message: "No draft found", draft: null });
    }

    res.status(200).json({ draft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSingleSubmission = async (req, res) => {
  try {
    const { submissionId } = req.body;
    const userId = req.user.id;

    const submission = await Submission.findOne({ _id: submissionId, userId });

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    res.status(200).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleSubmitCode,
  handleSaveCode,
  handleGetUserSubmissions,
  getSavedDraft,
  getSingleSubmission,
};
