const express = require('express');
const { getAnalytics, exportVisitsCsv } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.get('/:id', getAnalytics);
router.get('/:id/export.csv', exportVisitsCsv);

module.exports = router;
