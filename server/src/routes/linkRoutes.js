const express = require('express');
const { body } = require('express-validator');
const {
  createLink,
  getLinks,
  deleteLink,
  updateLink,
  getQRCode,
} = require('../controllers/linkController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createLinkLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  createLinkLimiter,
  [
    body('url').notEmpty().withMessage('URL is required'),
    body('customAlias')
      .optional()
      .matches(/^[a-zA-Z0-9-_]{3,20}$/)
      .withMessage('Custom alias must be 3-20 characters (letters, numbers, -, _)'),
    body('expiresAt').optional().isISO8601().withMessage('Invalid expiry date'),
  ],
  validate,
  createLink
);

router.get('/', getLinks);
router.delete('/:id', deleteLink);
router.patch(
  '/:id',
  [
    body('url').optional().notEmpty().withMessage('URL cannot be empty'),
    body('expiresAt').optional().isISO8601().withMessage('Invalid expiry date'),
  ],
  validate,
  updateLink
);
router.get('/:id/qr', getQRCode);

module.exports = router;
