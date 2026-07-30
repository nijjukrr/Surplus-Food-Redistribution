const { supabase, isConfigured } = require('../config/supabase');

class NotificationService {
  /**
   * Create and send in-app notification
   */
  async createNotification({ userId, title, message, type = 'status_update' }) {
    const notificationPayload = {
      user_id: userId || null,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };

    if (isConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert(notificationPayload)
          .select()
          .single();

        if (error) console.error('[Notification Error]:', error.message);
        return data;
      } catch (err) {
        console.error('[Notification Exception]:', err.message);
      }
    }

    return notificationPayload;
  }

  async getUserNotifications(userId) {
    if (isConfigured()) {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      return data || [];
    }
    return [
      {
        id: 'n1',
        title: 'Donation Priority Flagged',
        message: 'Your surplus food donation was flagged HIGH PRIORITY by Gemini AI.',
        type: 'ai_match',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ];
  }
}

module.exports = new NotificationService();
