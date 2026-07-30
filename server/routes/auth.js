const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, authController.getProfile);
router.post('/switch-role', authMiddleware, authController.switchRole);

module.exports = router;
