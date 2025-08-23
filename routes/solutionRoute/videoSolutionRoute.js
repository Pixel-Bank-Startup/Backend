const express = require("express");
const upload = require("../../cloudinaryService/upload");
const { handleAddVideoSolution, handleGetVideoSolutions, handleVoteVideoSolution } = require("../../controller/solutionController/videoSolution");
const router = express.Router();


router.post("/", protect, upload.single("video"), handleAddVideoSolution);
router.get("/:questionId", handleGetVideoSolutions);
router.patch("/vote/:solutionId", protect, handleVoteVideoSolution);

module.exports = router;
