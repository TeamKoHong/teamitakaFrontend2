const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const smsRateLimit = require('../middlewares/smsRateLimit');

// Apply rate limit middleware only to sending SMS
router.post('/send', smsRateLimit, smsController.sendVerificationCode);

// Verification doesn't strictly need the same strict rate limit, but could have retry limits. 
// For now, no specific rate limit on verify as per requirements (reqs only mentioned send limit context implied).
router.post('/verify', smsController.verifyCode);

module.exports = router;
