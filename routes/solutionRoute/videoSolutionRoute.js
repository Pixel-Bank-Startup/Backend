const express = require("express");
const upload = require("../../cloudinaryService/upload");
const { handleAddVideoSolution, handleGetVideoSolutions, handleVoteVideoSolution } = require("../../controller/solutionController/videoSolution");

const router = express.Router();


router.post("/video-solution/add",  handleAddVideoSolution);
router.get("/video-solution", handleGetVideoSolutions);
router.patch("/video-solution/vote/:solutionId", handleVoteVideoSolution);

module.exports = router;