const donationService = require('../services/donationService');
const aiService = require('../services/aiService');
const { successResponse, errorResponse } = require('../utils/formatters');

class DonationController {
  async createDonation(req, res, next) {
    try {
      const { title, quantity_kg, pickup_address } = req.body;
      if (!title || !quantity_kg || !pickup_address) {
        return res.status(400).json(errorResponse('Title, quantity_kg, and pickup_address are required', 400));
      }

      const donation = await donationService.createDonation(req.body, req.user);
      res.status(201).json(successResponse(donation, 'Food donation created and AI analyzed successfully'));
    } catch (err) {
      next(err);
    }
  }

  async getAllDonations(req, res, next) {
    try {
      const donations = await donationService.getAllDonations(req.query);
      res.json(successResponse(donations, 'Donations retrieved successfully'));
    } catch (err) {
      next(err);
    }
  }

  async getDonationById(req, res, next) {
    try {
      const donation = await donationService.getDonationById(req.params.id);
      if (!donation) {
        return res.status(404).json(errorResponse('Donation not found', 404));
      }
      res.json(successResponse(donation, 'Donation details retrieved'));
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const updated = await donationService.updateStatus(req.params.id, status, req.user);
      res.json(successResponse(updated, `Donation status updated to ${status}`));
    } catch (err) {
      next(err);
    }
  }

  async triggerAI(req, res, next) {
    try {
      const donation = await donationService.getDonationById(req.params.id);
      const prediction = await aiService.evaluateDonation(donation);
      res.json(successResponse(prediction, 'AI priority evaluation completed'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DonationController();
