const express = require('express');
const { handleCreateFeedback } = require('../../controller/feedbackController/problemFeedback');

const router = express.Router();

router.post('/',  handleCreateFeedback);

module.exports = router;
