const analyticsService = require('../services/analyticsService');
const donationService = require('../services/donationService');
const notificationService = require('../services/notificationService');
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
        { id: '11111111-1111-1111-1111-111111111111', name: 'Royal Spice Bistro', email: 'restaurant@foodbridge.ai', role: 'restaurant', status: 'Active', is_verified: true },
        { id: '22222222-2222-2222-2222-222222222222', name: 'Care & Share Foundation', email: 'ngo@foodbridge.ai', role: 'ngo', status: 'Active', is_verified: true },
        { id: '33333333-3333-3333-3333-333333333333', name: 'Alex Rivera', email: 'volunteer@foodbridge.ai', role: 'volunteer', status: 'Active', is_verified: true },
        { id: '44444444-4444-4444-4444-444444444444', name: 'System Admin', email: 'admin@foodbridge.ai', role: 'admin', status: 'Active', is_verified: true }
      ];
      res.json(successResponse(mockUsers, 'System users list retrieved'));
    } catch (err) {
      next(err);
    }
  }

  async getPendingDonations(req, res, next) {
    try {
      const all = await donationService.getAllDonations();
      const pending = all.filter(d => d.status === 'Pending Admin Review');
      res.json(successResponse(pending, 'Pending donations retrieved'));
    } catch (err) {
      next(err);
    }
  }

  async approveDonation(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await donationService.updateStatus(id, 'Approved', req.user);
      await notificationService.createNotification({
        title: 'Donation Approved by Admin',
        message: `Donation "${updated.title || id}" approved by Admin and forwarded to NGOs.`,
        type: 'status_update'
      });
      res.json(successResponse(updated, 'Donation approved and sent to NGOs'));
    } catch (err) {
      next(err);
    }
  }

  async rejectDonation(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await donationService.updateStatus(id, 'Rejected', req.user);
      await notificationService.createNotification({
        title: 'Donation Rejected by Admin',
        message: `Donation "${updated.title || id}" was rejected after review.`,
        type: 'status_update'
      });
      res.json(successResponse(updated, 'Donation rejected'));
    } catch (err) {
      next(err);
    }
  }

  async verifyRestaurant(req, res, next) {
    try {
      const { id } = req.params;
      await notificationService.createNotification({
        title: 'Restaurant Verified!',
        message: `Restaurant ID ${id} has been verified by Admin. Future donations will stream directly to NGOs.`,
        type: 'status_update'
      });
      res.json(successResponse({ id, is_verified: true }, 'Restaurant verified successfully'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
