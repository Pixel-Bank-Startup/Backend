const express = require('express');
const { getAllFeedback, getUserFeedback, updateFeedbackStatus } = require('../controllers/problemFeedbackController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getUserFeedback);
router.get('/', protect, adminOnly, getAllFeedback);

// Admin updates feedback status
router.put('/:id/status', protect, adminOnly, updateFeedbackStatus);

module.exports = router;
