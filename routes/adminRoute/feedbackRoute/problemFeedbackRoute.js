const express = require('express');
const router = express.Router();
const { handleGetUserFeedback, handleGetAllFeedback, handleUpdateFeedbackStatus } = require('../../../controller/feedbackController/problemFeedback');


router.get('/feedback/user',handleGetUserFeedback);
router.get('/feedback', handleGetAllFeedback);
router.put('/feedback/status/update',  handleUpdateFeedbackStatus);

module.exports = router;
