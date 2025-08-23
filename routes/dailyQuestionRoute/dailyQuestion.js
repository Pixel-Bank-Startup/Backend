const express = require('express');
const { handleGetDailyQuestion } = require('../../controller/dailyProblem/dailyProblem');
const router = express.Router();


router.get('/daily-question/new', handleGetDailyQuestion)

module.exports = router;
