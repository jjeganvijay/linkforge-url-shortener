const { mongoUri, jwtSecret, encryptionKey, googleClientId } = require('./env');

const validateEnv = () => {
  const missing = [];
  if (!mongoUri) missing.push('MONGODB_URI');
  if (!jwtSecret) missing.push('JWT_SECRET');
  if (!encryptionKey) missing.push('ENCRYPTION_KEY');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (!/^[0-9a-fA-F]{64}$/.test(encryptionKey)) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }

  if (jwtSecret.length < 16) {
    throw new Error('JWT_SECRET must be at least 16 characters');
  }

  if (googleClientId && googleClientId.length < 10) {
    throw new Error('GOOGLE_CLIENT_ID looks invalid');
  }
};

module.exports = validateEnv;
