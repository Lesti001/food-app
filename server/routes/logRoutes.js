const express = require('express');
const authMiddleware = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { getDailyLog, addLogEntry, deleteLogEntry } = require('../controllers/logController');

const router = express.Router();

router.use(authMiddleware);
router.get('/:date', asyncHandler(getDailyLog));
router.post('/', asyncHandler(addLogEntry));
router.delete('/:id', asyncHandler(deleteLogEntry));

module.exports = router;
