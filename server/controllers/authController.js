const { successResponse, errorResponse } = require('../utils/formatters');
const { supabase, isConfigured } = require('../config/supabase');

class AuthController {
  async getProfile(req, res, next) {
    try {
      res.json(successResponse(req.user, 'Profile retrieved successfully'));
    } catch (err) {
      next(err);
    }
  }

  async switchRole(req, res, next) {
    try {
      const { role } = req.body;
      if (!['restaurant', 'ngo', 'volunteer', 'admin'].includes(role)) {
        return res.status(400).json(errorResponse('Invalid role specified', 400));
      }

      req.user.role = role;
      res.json(successResponse({ user: req.user, activeRole: role }, `Switched role to ${role}`));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
