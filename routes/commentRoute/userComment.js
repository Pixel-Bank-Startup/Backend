const express = require('express');
const { handleAddComment, handleGetCommentsByQuestion } = require('../../controller/commentController/userController');
const checkForAuthenticationCookie = require('../../middleware/authMiddleware');
const router = express.Router();



router.post('/comments/add',checkForAuthenticationCookie("token"),  handleAddComment); 
router.get('/comments', handleGetCommentsByQuestion); 

module.exports = router;
