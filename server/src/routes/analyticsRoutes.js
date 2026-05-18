const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.get('/:id', getAnalytics);

module.exports = router;
