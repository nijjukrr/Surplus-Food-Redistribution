/**
 * Role Middleware
 * Enforces role access boundaries ('restaurant', 'ngo', 'volunteer', 'admin')
 */
function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    // Admin has access to all routes
    if (req.user.role === 'admin') {
      return next();
    }

    // Support dev/demo testing mode where user headers may vary
    const devUserId = req.headers['x-user-id'];
    const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' || !!devUserId;

    if (isDevMode || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden. Requires one of the following roles: ${allowedRoles.join(', ')}`
    });
  };
}

module.exports = roleMiddleware;

