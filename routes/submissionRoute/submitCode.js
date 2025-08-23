const express = require("express");
const router = express.Router();
const { handleSubmitCode, handleSaveCode, handleGetUserSubmissions, getSavedDraft, getSingleSubmission } = require("../../controller/submissionController/submissionController");

router.post("/code/submit",  handleSubmitCode);
router.post("/code/save",  handleSaveCode);
router.get("/code/all-submissions",  handleGetUserSubmissions);
router.get("/code/saved-draft",  getSavedDraft);
router.get("/code/submitted-single-code",  getSingleSubmission);

module.exports = router;
