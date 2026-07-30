/**
 * Centralized Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('[Error Handler Log]:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    status,
    details: process.env.NODE_ENV === 'development' ? err.stack : null,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
