const crypto = require('crypto');

const CSRF_COOKIE = 'csrfToken';
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const isProd = () => process.env.NODE_ENV === 'production';

const getCookieOptions = () => ({
  httpOnly: false,
  secure: isProd(),
  sameSite: isProd() ? 'none' : 'lax',
  path: '/',
});

const issueCsrfToken = (res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie(CSRF_COOKIE, token, getCookieOptions());
  return token;
};

const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  // Only enforce CSRF when cookie-based auth is in play.
  if (!req.cookies?.token) return next();

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get(CSRF_HEADER);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ success: false, message: 'CSRF validation failed' });
  }

  return next();
};

module.exports = { csrfProtection, issueCsrfToken };

