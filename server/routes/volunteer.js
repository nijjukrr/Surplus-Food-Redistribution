const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/claim-delivery/:id',
  authMiddleware,
  roleMiddleware(['volunteer', 'admin']),
  volunteerController.assignVolunteer
);

router.post(
  '/update-step/:id',
  authMiddleware,
  roleMiddleware(['volunteer', 'admin']),
  volunteerController.updateDeliveryStep
);

module.exports = router;
