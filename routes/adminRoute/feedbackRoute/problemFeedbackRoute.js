const express = require('express');
const { getAllFeedback, getUserFeedback, updateFeedbackStatus } = require('../controllers/problemFeedbackController');
const router = express.Router();

router.get('/feedback/my',getUserFeedback);
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id/status',  updateFeedbackStatus);

module.exports = router;
