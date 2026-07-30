const notificationService = require('../services/notificationService');
const { successResponse } = require('../utils/formatters');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getUserNotifications(req.user?.id);
      res.json(successResponse(notifications, 'Notifications fetched'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
