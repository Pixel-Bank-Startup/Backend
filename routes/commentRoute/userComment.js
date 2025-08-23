const express = require('express');
const { handleAddComment, handleGetCommentsByQuestion } = require('../../controller/commentController/userController');
const router = express.Router();



router.post('/',  handleAddComment); 
router.get('/:questionId', handleGetCommentsByQuestion); 

module.exports = router;
