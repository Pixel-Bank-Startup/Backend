const Submission = require("../../model/submissionModel/submissionModel");
const handleSubmitCode = async (req, res) => {

  return "dummy response"
};
//for saving code and handling drafts
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
//for get user submissions
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
//for saving draft
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

//for single submission of code 
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
