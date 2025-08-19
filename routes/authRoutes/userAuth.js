const express = require('express');
const { handleRegister, handleLogin, handleLogout, handleForgotPassword, handleResetPassword } = require('../../controller/authController/authController');
const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout',  handleLogout);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password/:resetToken',handleResetPassword);

module.exports = router;