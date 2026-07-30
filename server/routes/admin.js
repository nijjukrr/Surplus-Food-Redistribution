const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get(
  '/analytics',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getAnalytics
);

router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getUsers
);

module.exports = router;
