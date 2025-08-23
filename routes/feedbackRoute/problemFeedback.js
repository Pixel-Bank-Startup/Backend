const express = require('express');
const { handleCreateFeedback } = require('../../controller/feedbackController/problemFeedback');

const router = express.Router();

router.post('/feedback/add',  handleCreateFeedback);

module.exports = router;
