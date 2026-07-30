function successResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

function errorResponse(message = 'Error', status = 500, details = null) {
  return {
    success: false,
    message,
    status,
    details,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  successResponse,
  errorResponse
};
