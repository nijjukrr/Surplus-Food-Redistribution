const ngoService = require('../services/ngoService');
const { successResponse } = require('../utils/formatters');

class NgoController {
  async acceptDonation(req, res, next) {
    try {
      const result = await ngoService.acceptDonation(req.params.id, req.user);
      res.json(successResponse(result, 'Donation accepted by NGO successfully'));
    } catch (err) {
      next(err);
    }
  }

  async denyDonation(req, res, next) {
    try {
      const result = await ngoService.denyDonation(req.params.id, req.user);
      res.json(successResponse(result, 'Donation declined by NGO'));
    } catch (err) {
      next(err);
    }
  }

  async getNearbyDonations(req, res, next) {
    try {
      const donations = await ngoService.getNearbyDonations();
      res.json(successResponse(donations, 'Nearby donations fetched for NGO'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NgoController();
