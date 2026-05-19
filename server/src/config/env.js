const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const parseOrigins = (value, fallback) => {
  const raw = value || fallback;
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  encryptionKey: process.env.ENCRYPTION_KEY,
  allowedOrigins: parseOrigins(process.env.FRONTEND_URL, 'http://localhost:5173'),
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
};
