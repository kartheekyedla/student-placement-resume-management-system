// server/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    // Never leak stack traces to client (as per SRS Section 6)
    errorType: err.name || 'ServerError'
  });
};

module.exports = errorHandler;
