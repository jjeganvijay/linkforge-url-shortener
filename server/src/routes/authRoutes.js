const express = require('express');
const { body } = require('express-validator');
const {
  signup,
  login,
  loginWithGoogle,
  getMe,
  logout,
  updateProfile,
  getCsrf,
  deleteAccount,
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/csrf', getCsrf);

router.post(
  '/signup',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  signup
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post(
  '/google',
  authLimiter,
  [body('credential').notEmpty().withMessage('Google credential is required')],
  validate,
  loginWithGoogle
);

router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile);
router.delete('/me', auth, deleteAccount);
router.post('/logout', auth, logout);

module.exports = router;
