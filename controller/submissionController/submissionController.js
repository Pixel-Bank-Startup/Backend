const Submission = require("../../model/submissionModel/submissionModel");
const Problem = require("../../model/problemModel/problem");
const User = require("../../model/authModel/userModel");
const Statistics = require("../../model/userStatistics/stats");
const { handleAwardBadgeForStreak } = require("../badgeAward/userBadge");
const axios = require("axios");

const languageMap = {
  python: 92,
  cpp: 54,
  javascript: 93,
  java: 91,
  c: 50,
};

const executeCode = async (code, language, stdin) => {
  try {
    const langId = languageMap[language];
    if (!langId) throw new Error(`Unsupported language: ${language}`);

    const url = process.env.JUDGE0_API_URL;

    const response = await axios.post(
      url,
      {
        source_code: code,
        language_id: langId,
        stdin: stdin,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Judge0 API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Judge0 API Error:", error.message);
    return {
      stdout: null,
      stderr: error.response?.data || error.message,
      compile_output: null,
      token: error.response?.data?.token || null,
      time: null,
      memory: null,
      status: { description: "Error" },
      _error: true,
    };
  }
};


const lastNonEmptyLine = (txt) => {
  if (!txt) return "";
  return String(txt)
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .pop() || "";
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

    const testCases = problem.testCases || [];
    if (!testCases.length) {
      return res.status(400).json({ message: "No test cases available for this problem" });
    }

    let allPassed = true;
    let userOutputs = [];
    let expectedOutputs = [];
    let judgeResponses = [];
    let results = [];

    for (const test of testCases) {
      const combinedCode = `${code}\n${test.input}`;

      const resp = await executeCode(combinedCode, language, "");

      judgeResponses.push(resp);
      const stdoutLast = lastNonEmptyLine(resp.stdout);
      const stderrLast = lastNonEmptyLine(typeof resp.stderr === "string" ? resp.stderr : JSON.stringify(resp.stderr || ""));
      const compileLast = lastNonEmptyLine(resp.compile_output);

      let userOutputSingle = stdoutLast || stderrLast || compileLast || "";
      const expectedOutput = String(test.expectedOutput || "").trim();

      userOutputs.push(userOutputSingle);
      expectedOutputs.push(expectedOutput);

      const passed = userOutputSingle === expectedOutput;
      results.push({
        testCase: test.input,
        userOutput: userOutputSingle,
        expectedOutput,
        passed,
      });

      if (!passed) allPassed = false;
    }

    const status = allPassed ? "passed" : "failed";

    let isFirstSolve = false;
    if (allPassed) {
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

        if (stats.lastSolvedDate) {
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
      userOutput: userOutputs,
      expectedOutput: expectedOutputs,
      judgeResponses,
      results,
      status,
      submittedAt: new Date(),
    });

    await submission.save();
    await handleAwardBadgeForStreak(userId);

    return res.status(200).json({
      message: "Submission saved successfully",
      submissionId: submission.id,
      status,
      userOutput: userOutputs,
      expectedOutput: expectedOutputs,
      results,
      firstSolve: isFirstSolve,
    });
  } catch (error) {
    console.error("Error in handleSubmitCode:", error);
    return res.status(500).json({
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
    const { problemId } = req.params;

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
    const { problemId } = req.params;
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
    const { submissionId } = req.params;
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
