const volunteerService = require('../services/volunteerService');
const { successResponse } = require('../utils/formatters');

class VolunteerController {
  async assignVolunteer(req, res, next) {
    try {
      const result = await volunteerService.assignVolunteer(req.params.id, req.user);
      res.json(successResponse(result, 'Volunteer assigned to donation pickup'));
    } catch (err) {
      next(err);
    }
  }

  async updateDeliveryStep(req, res, next) {
    try {
      const { step } = req.body;
      const result = await volunteerService.updateDeliveryStep(req.params.id, step, req.user);
      res.json(successResponse(result, `Delivery step updated to ${step}`));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new VolunteerController();
