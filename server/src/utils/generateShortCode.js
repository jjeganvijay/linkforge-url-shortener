const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const RESERVED_CODES = new Set([
  'api',
  'auth',
  'login',
  'signup',
  'dashboard',
  'stats',
  'public',
  'health',
  'link-error',
]);

const isReservedCode = (code) => RESERVED_CODES.has(String(code).toLowerCase());

const generateShortCode = (length = 7) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
};

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizeUrl = (url) => {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

module.exports = { generateShortCode, isValidUrl, normalizeUrl, isReservedCode, RESERVED_CODES };
