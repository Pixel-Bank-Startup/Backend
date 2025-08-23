const VideoSolution = require("../models/VideoSolution");

const handleAddVideoSolution = async (req, res) => {
  try {
    const { questionId, description } = req.body;
    const videoUrl = req.file?.path; // if using multer + cloudinary

    if (!videoUrl) return res.status(400).json({ message: "Video is required" });

    const videoSolution = await VideoSolution.create({
      questionId,
      userId: req.user._id,
      videoUrl,
      description,
    });

    res.status(201).json({
      message: "Video solution uploaded successfully",
      videoSolution,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video solution", error });
  }
};


const handleGetVideoSolutions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const solutions = await VideoSolution.find({ questionId }).populate("userId", "name");
    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching video solutions", error });
  }
};


const handleVoteVideoSolution = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const { type } = req.body; // "upvote" or "downvote"

    const videoSolution = await VideoSolution.findById(solutionId);
    if (!videoSolution) return res.status(404).json({ message: "Solution not found" });

    if (type === "upvote") {
      videoSolution.upvotes += 1;
    } else if (type === "downvote") {
      videoSolution.downvotes += 1;
    }

    await videoSolution.save();
    res.status(200).json(videoSolution);
  } catch (error) {
    res.status(500).json({ message: "Error voting solution", error });
  }
};
module.exports = {
  handleAddVideoSolution,
  handleGetVideoSolutions,
  handleVoteVideoSolution
};
