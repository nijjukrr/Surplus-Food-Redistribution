const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get(
  '/nearby-donations',
  authMiddleware,
  roleMiddleware(['ngo', 'admin']),
  ngoController.getNearbyDonations
);

router.post(
  '/accept-donation/:id',
  authMiddleware,
  roleMiddleware(['ngo', 'admin']),
  ngoController.acceptDonation
);

router.post(
  '/deny-donation/:id',
  authMiddleware,
  roleMiddleware(['ngo', 'admin']),
  ngoController.denyDonation
);

module.exports = router;
