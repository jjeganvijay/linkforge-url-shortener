const crypto = require('crypto');
const { encryptionKey } = require('../config/env');

const ALGORITHM = 'aes-256-gcm';

const getKey = () => {
  const key = Buffer.from(encryptionKey, 'hex');
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }
  return key;
};

const encrypt = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    encryptedUrl: encrypted,
    urlIv: iv.toString('hex'),
    urlAuthTag: authTag.toString('hex'),
  };
};

const decrypt = (encryptedUrl, urlIv, urlAuthTag) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(urlIv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(urlAuthTag, 'hex'));
  let decrypted = decipher.update(encryptedUrl, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
