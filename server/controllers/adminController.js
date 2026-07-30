const analyticsService = require('../services/analyticsService');
const { successResponse } = require('../utils/formatters');

class AdminController {
  async getAnalytics(req, res, next) {
    try {
      const analytics = await analyticsService.getDashboardAnalytics();
      res.json(successResponse(analytics, 'Admin analytics metrics retrieved'));
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const mockUsers = [
        { id: '1', name: 'Royal Spice Bistro', email: 'restaurant@foodbridge.ai', role: 'restaurant', status: 'Active' },
        { id: '2', name: 'Care & Share Foundation', email: 'ngo@foodbridge.ai', role: 'ngo', status: 'Active' },
        { id: '3', name: 'Alex Rivera', email: 'volunteer@foodbridge.ai', role: 'volunteer', status: 'Active' },
        { id: '4', name: 'System Admin', email: 'admin@foodbridge.ai', role: 'admin', status: 'Active' }
      ];
      res.json(successResponse(mockUsers, 'System users list retrieved'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
