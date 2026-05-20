const { allowedOrigins } = require('../config/env');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

module.exports = function originCheck(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.headers.origin;
  if (!origin) return next(); // non-browser clients

  if (allowedOrigins.includes(origin)) return next();

  return res.status(403).json({
    success: false,
    message: 'Blocked by origin policy',
  });
};

