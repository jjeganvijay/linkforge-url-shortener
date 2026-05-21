const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { jwtSecret } = require('../config/env');
const { googleClientId } = require('../config/env');

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
};

const getAuthCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

const getClearAuthCookieOptions = () => {
  const { maxAge, ...rest } = getAuthCookieOptions();
  return rest;
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, getAuthCookieOptions());
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google sign-in. Please continue with Google.',
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
};

const logout = (req, res) => {
  res.clearCookie('token', getClearAuthCookieOptions());
  res.json({ success: true, message: 'Logged out successfully' });
};

const { issueCsrfToken } = require('../middleware/csrf');

const getCsrf = (req, res) => {
  const existing = req.cookies?.csrfToken;
  if (existing) {
    return res.json({ success: true, data: { csrfToken: existing } });
  }
  const token = issueCsrfToken(res);
  res.json({ success: true, data: { csrfToken: token } });
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = req.user;

    const updates = {};
    if (name !== undefined && name.trim()) {
      updates.name = name.trim();
    }
    if (email !== undefined && email.trim()) {
      const emailExists = await User.findOne({ email: email.trim(), _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
      updates.email = email.trim().toLowerCase();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
}; 

const clearSessionCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', getClearAuthCookieOptions());
  res.clearCookie('csrfToken', {
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
};

const deleteAccount = async (req, res) => {
  try {
    const Link = require('../models/Link');
    const Visit = require('../models/Visit');

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const links = await Link.find({ userId }, { _id: 1 }).lean();
    const linkIds = links.map((l) => l._id);

    let deletedVisits = 0;
    if (linkIds.length > 0) {
      const visitResult = await Visit.deleteMany({ linkId: { $in: linkIds } });
      deletedVisits = visitResult.deletedCount || 0;
    }

    const linkResult = await Link.deleteMany({ userId });
    const deletedLinks = linkResult.deletedCount || 0;

    await User.deleteOne({ _id: userId });

    clearSessionCookies(res);

    res.json({
      success: true,
      message: 'Account deleted successfully',
      data: { deletedLinks, deletedVisits },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const credential = req.body?.credential;
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }
    if (!googleClientId) {
      return res.status(500).json({ success: false, message: 'Google login is not configured' });
    }

    let OAuth2Client;
    try {
      ({ OAuth2Client } = require('google-auth-library'));
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Google login dependency is missing (run npm install in server/)',
      });
    }
    const googleClient = new OAuth2Client(googleClientId);

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid Google credential' });
    }

    const email = payload?.email ? String(payload.email).toLowerCase() : null;
    const name = payload?.name ? String(payload.name) : 'Google User';
    const sub = payload?.sub ? String(payload.sub) : null;
    const pictureUrl = payload?.picture ? String(payload.picture) : null;

    if (!email || !sub) {
      return res.status(401).json({ success: false, message: 'Google credential missing email' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        passwordHash: null,
        authProvider: 'google',
        googleSub: sub,
        pictureUrl,
      });
    } else {
      // Allow linking an existing local account to Google (same email).
      const updates = {
        authProvider: user.authProvider === 'local' ? 'google' : user.authProvider,
        googleSub: user.googleSub || sub,
        pictureUrl: pictureUrl || user.pictureUrl,
      };
      user = await User.findByIdAndUpdate(user._id, updates, { new: true });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during Google login' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  getCsrf,
  updateProfile,
  deleteAccount,
  loginWithGoogle,
};
