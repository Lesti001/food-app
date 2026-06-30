const express = require('express');
const authMiddleware = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const {
  getDailyLog,
  getHistorySummary,
  addLogEntry,
  updateLogEntry,
  deleteLogEntry,
} = require('../controllers/logController');

const router = express.Router();

router.use(authMiddleware);
router.get('/summary', asyncHandler(getHistorySummary));
router.get('/:date', asyncHandler(getDailyLog));
router.post('/', asyncHandler(addLogEntry));
router.patch('/:id', asyncHandler(updateLogEntry));
router.delete('/:id', asyncHandler(deleteLogEntry));

module.exports = router;
