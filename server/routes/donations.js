const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['restaurant', 'admin']),
  donationController.createDonation
);

router.get('/', authMiddleware, donationController.getAllDonations);

router.get('/:id', authMiddleware, donationController.getDonationById);

router.patch(
  '/:id/status',
  authMiddleware,
  donationController.updateStatus
);

router.post(
  '/:id/evaluate-ai',
  authMiddleware,
  donationController.triggerAI
);

module.exports = router;
