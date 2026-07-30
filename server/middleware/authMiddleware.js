const { supabase, isConfigured } = require('../config/supabase');

/**
 * Authentication Middleware
 * Verifies Supabase Auth JWT token or fallback user header
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const devUserId = req.headers['x-user-id'];
    const devUserRole = req.headers['x-user-role'];

    // Support direct role header for rapid testing/dev mode
    if (devUserRole && devUserId) {
      req.user = {
        id: devUserId,
        role: devUserRole,
        email: `${devUserRole}@foodbridge.ai`
      };
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Default to guest/demo restaurant context if no header present in dev mode
      req.user = {
        id: '11111111-1111-1111-1111-111111111111',
        role: req.headers['x-role'] || 'restaurant',
        email: 'restaurant@foodbridge.ai'
      };
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (isConfigured()) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }

      // Fetch user profile to get role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email,
        role: profile?.role || 'restaurant',
        profile
      };
    } else {
      // Fallback dev mode user
      req.user = {
        id: '11111111-1111-1111-1111-111111111111',
        role: req.headers['x-role'] || 'restaurant',
        email: 'dev@foodbridge.ai'
      };
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
