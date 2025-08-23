const express = require('express');
const router = express.Router();
const { dailyQuestionUpdate } = require('../../../controller/dailyProblem/dailyProblem');

router.get('/daily-question/update', dailyQuestionUpdate)

module.exports = router;
