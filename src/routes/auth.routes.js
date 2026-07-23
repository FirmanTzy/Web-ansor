const express = require('express');
const router = express.Router();

const { login, forgotPassword, verifyOtp, resetPassword } = require('../controllers/auth.controller');

// POST /api/admin/login
router.post('/login', login);

// POST /api/admin/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/admin/verify-otp
router.post('/verify-otp', verifyOtp);

// POST /api/admin/reset-password
router.post('/reset-password', resetPassword);

module.exports = router;

