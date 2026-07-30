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

router.get(
  '/pending-donations',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getPendingDonations
);

router.post(
  '/approve-donation/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.approveDonation
);

router.post(
  '/reject-donation/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.rejectDonation
);

router.post(
  '/verify-restaurant/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.verifyRestaurant
);

module.exports = router;
