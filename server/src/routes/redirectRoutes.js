const express = require('express');
const { handleRedirect } = require('../controllers/analyticsController');
const { redirectLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/:shortCode', redirectLimiter, handleRedirect);

module.exports = router;
